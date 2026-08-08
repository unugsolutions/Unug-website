-- ============================================================
-- UNUG — Fix "new row violates row-level security policy"
-- on public forms (contact / quote).
--
-- Two common causes, both covered here:
--   1. The admin is logged into the dashboard in the same browser,
--      so the insert runs as the `authenticated` role, which has no
--      INSERT policy -> blocked.
--   2. The anon INSERT policy is missing (migration not run).
--
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query).
-- It is idempotent — safe to run more than once.
-- ============================================================

-- Anonymous visitors can submit contact messages
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_messages'
      and policyname = 'contact_messages_anon_insert'
  ) then
    create policy "contact_messages_anon_insert"
      on public.contact_messages for insert
      to anon
      with check (true);
  end if;
end $$;

-- Logged-in administrators can also submit contact messages
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_messages'
      and policyname = 'contact_messages_auth_insert'
  ) then
    create policy "contact_messages_auth_insert"
      on public.contact_messages for insert
      to authenticated
      with check (true);
  end if;
end $$;

-- Anonymous visitors can submit quote requests
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'quote_requests'
      and policyname = 'quote_requests_anon_insert'
  ) then
    create policy "quote_requests_anon_insert"
      on public.quote_requests for insert
      to anon
      with check (true);
  end if;
end $$;

-- Logged-in administrators can also submit quote requests
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'quote_requests'
      and policyname = 'quote_requests_auth_insert'
  ) then
    create policy "quote_requests_auth_insert"
      on public.quote_requests for insert
      to authenticated
      with check (true);
  end if;
end $$;
