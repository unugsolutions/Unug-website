-- ============================================================
-- UNUG — Trusted companies table + Row Level Security + Storage bucket
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query)
-- ============================================================

-- Trusted companies table
create table if not exists public.trusted_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- If the sections column exists from an earlier version, remove it.
alter table public.trusted_companies
  drop column if exists sections;

-- Row Level Security
alter table public.trusted_companies enable row level security;

-- Public visitors can only read published companies
create policy "trusted_companies_public_read"
  on public.trusted_companies for select
  to anon
  using (status = 'published');

-- Authenticated administrators can read every company (including drafts)
create policy "trusted_companies_auth_read_all"
  on public.trusted_companies for select
  to authenticated
  using (true);

-- Only authenticated administrators can write
create policy "trusted_companies_auth_insert"
  on public.trusted_companies for insert
  to authenticated
  with check (true);

create policy "trusted_companies_auth_update"
  on public.trusted_companies for update
  to authenticated
  using (true);

create policy "trusted_companies_auth_delete"
  on public.trusted_companies for delete
  to authenticated
  using (true);

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

drop trigger if exists trusted_companies_set_updated_at on public.trusted_companies;
create trigger trusted_companies_set_updated_at
  before update on public.trusted_companies
  for each row
  execute function public.set_updated_at();

-- Indexes
create index if not exists trusted_companies_status_idx on public.trusted_companies (status);
create index if not exists trusted_companies_display_order_idx on public.trusted_companies (display_order);

-- ============================================================
-- Storage: public "trusted-companies" bucket (logos/)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'trusted-companies',
  'trusted-companies',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
on conflict (id) do nothing;

-- Anyone can view company logos
create policy "trusted_companies_public_read"
  on storage.objects for select
  to anon
  using (bucket_id = 'trusted-companies');

create policy "trusted_companies_auth_read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'trusted-companies');

-- Only authenticated administrators can upload and manage logos
create policy "trusted_companies_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'trusted-companies');

create policy "trusted_companies_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'trusted-companies');

create policy "trusted_companies_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'trusted-companies');

-- ============================================================
-- Seed data (existing trusted companies — logos uploaded later)
-- ============================================================
insert into public.trusted_companies (name, website_url, display_order, status)
values
  ('TechCorp', 'https://techcorp.com', 1, 'published'),
  ('InnovateAI', 'https://innovateai.com', 2, 'published'),
  ('CloudBase', 'https://cloudbase.io', 3, 'published'),
  ('DataFlow', 'https://dataflow.com', 4, 'published'),
  ('NexGen', 'https://nexgen.com', 5, 'published')
on conflict do nothing;
