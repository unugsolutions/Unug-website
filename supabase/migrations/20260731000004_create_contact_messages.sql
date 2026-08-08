-- ============================================================
-- UNUG — Contact Messages table + Row Level Security + Realtime
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query)
-- ============================================================

-- Contact messages table (submitted through the public contact form)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text,
  email text not null,
  phone text,
  service text,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'replied', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  is_read boolean not null default false,
  assigned_to text,
  notes text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table public.contact_messages enable row level security;

-- Public visitors can ONLY submit messages (insert)
-- They cannot read, edit, or delete any messages.
create policy "contact_messages_anon_insert"
  on public.contact_messages for insert
  to anon
  with check (true);

-- Authenticated administrators can read every message
create policy "contact_messages_auth_read"
  on public.contact_messages for select
  to authenticated
  using (true);

-- Authenticated administrators can update messages (status, priority, notes, etc.)
create policy "contact_messages_auth_update"
  on public.contact_messages for update
  to authenticated
  using (true);

-- Authenticated administrators can delete messages
create policy "contact_messages_auth_delete"
  on public.contact_messages for delete
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

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at
  before update on public.contact_messages
  for each row
  execute function public.set_updated_at();

-- Indexes for the most common dashboard queries
create index if not exists contact_messages_submitted_at_idx on public.contact_messages (submitted_at desc);
create index if not exists contact_messages_is_read_idx on public.contact_messages (is_read);
create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_priority_idx on public.contact_messages (priority);
create index if not exists contact_messages_service_idx on public.contact_messages (service);

-- ============================================================
-- Realtime: the admin dashboard updates automatically when a
-- new message is submitted through the public website.
-- ============================================================
do $$
begin
  alter publication supabase_realtime add table public.contact_messages;
exception
  when duplicate_object then null;
end $$;
