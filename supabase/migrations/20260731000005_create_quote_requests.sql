-- ============================================================
-- UNUG — Quote Requests table + RLS + Reference RPC + Storage bucket
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query)
-- ============================================================

-- Sequence used to build unique reference numbers (UNUG-2026-0001, ...)
create sequence if not exists public.quote_reference_seq;

-- Quote requests table (submitted through the public "Request a Quote" page)
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique default (
    'UNUG-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.quote_reference_seq')::text, 4, '0')
  ),
  full_name text not null,
  company text,
  email text not null,
  phone text not null,
  country text,
  service text not null,
  project_type text not null,
  project_title text not null,
  project_description text not null,
  budget_min numeric,
  budget_max numeric,
  currency text default 'USD',
  timeline text not null,
  preferred_contact text not null,
  attachments jsonb default '[]'::jsonb,
  status text not null default 'new' check (status in ('new', 'reviewing', 'quoted', 'negotiation', 'approved', 'rejected', 'completed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  assigned_to text,
  estimated_price numeric,
  estimated_duration text,
  internal_notes text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table public.quote_requests enable row level security;

-- Public visitors can ONLY submit requests (insert).
-- They cannot read, edit, or delete any requests.
create policy "quote_requests_anon_insert"
  on public.quote_requests for insert
  to anon
  with check (true);

-- Authenticated administrators can read every request
create policy "quote_requests_auth_read"
  on public.quote_requests for select
  to authenticated
  using (true);

-- Authenticated administrators can update requests (status, priority, estimate, notes, etc.)
create policy "quote_requests_auth_update"
  on public.quote_requests for update
  to authenticated
  using (true);

-- Authenticated administrators can delete requests
create policy "quote_requests_auth_delete"
  on public.quote_requests for delete
  to authenticated
  using (true);

-- Public inserts rely on the sequence default to build the reference number
grant usage on sequence public.quote_reference_seq to anon, authenticated;

-- Keep updated_at fresh on every update
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists quote_requests_set_updated_at on public.quote_requests;
create trigger quote_requests_set_updated_at
  before update on public.quote_requests
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- Submit RPC (security definer)
-- Public visitors call this to create a request and receive the
-- auto-generated reference number back (they have no SELECT access).
-- ============================================================
create or replace function public.submit_quote_request(
  p_full_name text,
  p_company text,
  p_email text,
  p_phone text,
  p_country text,
  p_service text,
  p_project_type text,
  p_project_title text,
  p_project_description text,
  p_budget_min numeric,
  p_budget_max numeric,
  p_currency text,
  p_timeline text,
  p_preferred_contact text,
  p_attachments jsonb
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reference text;
begin
  insert into public.quote_requests (
    full_name, company, email, phone, country, service, project_type, project_title,
    project_description, budget_min, budget_max, currency, timeline, preferred_contact, attachments
  ) values (
    p_full_name,
    nullif(p_company, ''),
    p_email,
    p_phone,
    nullif(p_country, ''),
    p_service,
    p_project_type,
    p_project_title,
    p_project_description,
    p_budget_min,
    p_budget_max,
    coalesce(nullif(p_currency, ''), 'USD'),
    p_timeline,
    p_preferred_contact,
    coalesce(p_attachments, '[]'::jsonb)
  )
  returning reference_number into v_reference;

  return v_reference;
end;
$$;

revoke all on function public.submit_quote_request(
  text, text, text, text, text, text, text, text, text, numeric, numeric, text, text, text, jsonb
) from public;

grant execute on function public.submit_quote_request(
  text, text, text, text, text, text, text, text, text, numeric, numeric, text, text, text, jsonb
) to anon, authenticated;

-- Indexes for the most common dashboard queries
create index if not exists quote_requests_reference_idx on public.quote_requests (reference_number);
create index if not exists quote_requests_status_idx on public.quote_requests (status);
create index if not exists quote_requests_priority_idx on public.quote_requests (priority);
create index if not exists quote_requests_service_idx on public.quote_requests (service);
create index if not exists quote_requests_submitted_at_idx on public.quote_requests (submitted_at desc);

-- ============================================================
-- Storage: public "quote-attachments" bucket (attachments/)
-- Public visitors can upload, administrators manage.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'quote-attachments',
  'quote-attachments',
  true,
  10485760,
  array[
    'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip', 'text/plain', 'text/csv'
  ]
)
on conflict (id) do nothing;

-- Public visitors can upload attachments
create policy "quote_attachments_anon_insert"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'quote-attachments');

create policy "quote_attachments_anon_select"
  on storage.objects for select
  to anon
  using (bucket_id = 'quote-attachments');

-- Authenticated administrators can view and manage attachments
create policy "quote_attachments_auth_select"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'quote-attachments');

create policy "quote_attachments_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'quote-attachments');

create policy "quote_attachments_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'quote-attachments');

create policy "quote_attachments_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'quote-attachments');

-- ============================================================
-- Realtime: the admin dashboard updates automatically when a
-- new request is submitted through the public website.
-- ============================================================
do $$
begin
  alter publication supabase_realtime add table public.quote_requests;
exception
  when duplicate_object then null;
end $$;
