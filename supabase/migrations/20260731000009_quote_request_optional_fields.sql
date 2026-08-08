-- ============================================================
-- UNUG — Quote Requests: make budget/currency/preferred_contact/attachments optional
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query)
-- Applies after 20260731000005_create_quote_requests.sql.
-- ============================================================

-- The public "Request a Quote" form no longer collects a preferred contact method,
-- so it cannot be NOT NULL anymore.
alter table public.quote_requests
  alter column preferred_contact drop not null;

-- Recreate the submit RPC so the removed form fields can be omitted:
-- budget, currency, preferred contact and attachments now have defaults.
-- The argument list (types) is unchanged, so existing grants still apply.
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
  p_budget_min numeric default null,
  p_budget_max numeric default null,
  p_currency text default 'USD',
  p_timeline text default null,
  p_preferred_contact text default null,
  p_attachments jsonb default '[]'::jsonb
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
