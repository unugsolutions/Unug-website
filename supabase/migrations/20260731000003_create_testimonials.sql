-- ============================================================
-- UNUG — Testimonials table + Row Level Security + Storage bucket
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query)
-- ============================================================

-- Testimonials table
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  position text not null,
  company text not null,
  email text,
  photo_url text,
  rating integer not null default 5 check (rating between 1 and 5),
  testimonial text not null,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table public.testimonials enable row level security;

-- Public visitors can only read published testimonials
create policy "testimonials_public_read"
  on public.testimonials for select
  to anon
  using (status = 'published');

-- Authenticated administrators can read every testimonial (including drafts)
create policy "testimonials_auth_read_all"
  on public.testimonials for select
  to authenticated
  using (true);

-- Only authenticated administrators can write
create policy "testimonials_auth_insert"
  on public.testimonials for insert
  to authenticated
  with check (true);

create policy "testimonials_auth_update"
  on public.testimonials for update
  to authenticated
  using (true);

create policy "testimonials_auth_delete"
  on public.testimonials for delete
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

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row
  execute function public.set_updated_at();

-- Indexes
create index if not exists testimonials_status_idx on public.testimonials (status);
create index if not exists testimonials_featured_idx on public.testimonials (featured);
create index if not exists testimonials_rating_idx on public.testimonials (rating);
create index if not exists testimonials_display_order_idx on public.testimonials (display_order);

-- ============================================================
-- Storage: public "testimonials" bucket (photos/)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'testimonials',
  'testimonials',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
on conflict (id) do nothing;

-- Anyone can view testimonial photos
create policy "testimonials_public_read"
  on storage.objects for select
  to anon
  using (bucket_id = 'testimonials');

create policy "testimonials_auth_read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'testimonials');

-- Only authenticated administrators can upload and manage photos
create policy "testimonials_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'testimonials');

create policy "testimonials_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'testimonials');

create policy "testimonials_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'testimonials');

-- ============================================================
-- Seed data (photos are uploaded via the admin dashboard,
-- the public site falls back to initials avatars until then)
-- ============================================================
insert into public.testimonials
  (client_name, position, company, email, rating, testimonial, featured, display_order, status)
values
  (
    'Business Owner',
    'Founder',
    'Retail Client',
    'owner@example.com',
    5,
    'UNUG delivered a modern, responsive website that exceeded our expectations. The team was professional, communicated clearly, and completed the project on time.',
    true,
    1,
    'published'
  ),
  (
    'Organization Representative',
    'Program Manager',
    'NGO Client',
    'org@example.com',
    5,
    'Working with UNUG was a smooth experience from planning to delivery. They understood our requirements and built a solution that was both user-friendly and reliable.',
    true,
    2,
    'published'
  ),
  (
    'Company Director',
    'Director',
    'Enterprise Client',
    'director@example.com',
    5,
    'The quality of work, attention to detail, and ongoing support made UNUG an excellent technology partner. We look forward to working together again.',
    true,
    3,
    'published'
  ),
  (
    'Operations Lead',
    'Operations Manager',
    'Logistics Client',
    'ops@example.com',
    4,
    'Our internal systems were transformed by the custom software UNUG built for us. Processes that took days now complete in hours, and the team was a pleasure to work with.',
    false,
    4,
    'published'
  ),
  (
    'Product Manager',
    'Product Manager',
    'E-Commerce Client',
    'pm@example.com',
    5,
    'From the design phase to launch, UNUG guided us at every step. The mobile app they built has become a core part of our customer experience.',
    false,
    5,
    'published'
  ),
  (
    'Startup Founder',
    'CEO',
    'Fintech Client',
    'founder@example.com',
    4,
    'UNUG helped us move from an idea to a live platform in record time. Their technical expertise and clear communication made all the difference.',
    false,
    6,
    'draft'
  );
