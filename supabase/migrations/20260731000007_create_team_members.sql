-- ============================================================
-- UNUG — Team Members table + Row Level Security + Storage bucket
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query)
-- ============================================================

-- Team members table
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  full_name text generated always as (btrim(coalesce(first_name, '') || ' ' || coalesce(last_name, ''))) stored,
  position text not null,
  department text,
  bio text,
  photo_url text,
  email text,
  phone text,
  linkedin_url text,
  github_url text,
  facebook_url text,
  instagram_url text,
  x_url text,
  website_url text,
  skills jsonb not null default '[]'::jsonb,
  years_experience integer not null default 0 check (years_experience >= 0),
  display_order integer not null default 0,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  joined_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table public.team_members enable row level security;

-- Public visitors can only read published team members
create policy "team_members_public_read"
  on public.team_members for select
  to anon
  using (status = 'published');

-- Authenticated administrators can read every member (including drafts)
create policy "team_members_auth_read_all"
  on public.team_members for select
  to authenticated
  using (true);

-- Only authenticated administrators can write
create policy "team_members_auth_insert"
  on public.team_members for insert
  to authenticated
  with check (true);

create policy "team_members_auth_update"
  on public.team_members for update
  to authenticated
  using (true);

create policy "team_members_auth_delete"
  on public.team_members for delete
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

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
  before update on public.team_members
  for each row
  execute function public.set_updated_at();

-- Indexes
create index if not exists team_members_status_idx on public.team_members (status);
create index if not exists team_members_featured_idx on public.team_members (featured);
create index if not exists team_members_department_idx on public.team_members (department);
create index if not exists team_members_display_order_idx on public.team_members (display_order);

-- ============================================================
-- Storage: public "team" bucket (photos/)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'team',
  'team',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
on conflict (id) do nothing;

-- Anyone can view team photos
create policy "team_public_read"
  on storage.objects for select
  to anon
  using (bucket_id = 'team');

create policy "team_auth_read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'team');

-- Only authenticated administrators can upload and manage photos
create policy "team_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'team');

create policy "team_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'team');

create policy "team_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'team');

-- ============================================================
-- Seed data (photos are uploaded via the admin dashboard,
-- the public site falls back to initials avatars until then)
-- ============================================================
insert into public.team_members
  (first_name, last_name, position, department, bio, email, skills, years_experience, display_order, featured, status, joined_date)
values
  (
    'Mohamed',
    'Badel',
    'Chief Executive Officer',
    'Leadership',
    'Mohamed leads UNUG with a passion for building reliable, scalable digital solutions. He oversees company strategy, partnerships, and the quality of every project we deliver.',
    'mohamed@unug.example',
    '["Leadership", "Strategy", "Software Engineering", "Business Development"]',
    8,
    1,
    true,
    'published',
    '2019-03-01'
  ),
  (
    'Amina',
    'Hassan',
    'Head of Design',
    'Design',
    'Amina is the creative force behind UNUG, crafting clean, user-centered interfaces. She brings deep expertise in design systems and product design.',
    'amina@unug.example',
    '["UI/UX", "Figma", "Design Systems", "Prototyping"]',
    6,
    2,
    true,
    'published',
    '2020-06-15'
  ),
  (
    'Abdirahman',
    'Yusuf',
    'Senior Full-Stack Developer',
    'Engineering',
    'Abdirahman builds the technology that powers our clients'' platforms. He specializes in modern web development with React, Node.js, and Supabase.',
    'abdirahman@unug.example',
    '["React", "Next.js", "Node.js", "Supabase", "PostgreSQL"]',
    5,
    3,
    true,
    'published',
    '2021-02-10'
  ),
  (
    'Hodan',
    'Ali',
    'Project Manager',
    'Operations',
    'Hodan keeps every project on track, on budget, and on time. She coordinates teams and clients with a focus on clear communication and smooth delivery.',
    'hodan@unug.example',
    '["Agile", "Scrum", "Project Management", "Communication"]',
    4,
    4,
    false,
    'published',
    '2022-09-01'
  ),
  (
    'Ahmed',
    'Osman',
    'Mobile Developer',
    'Engineering',
    'Ahmed develops native and cross-platform mobile applications with a focus on performance and usability.',
    'ahmed@unug.example',
    '["React Native", "Flutter", "Mobile Development", "Dart"]',
    3,
    5,
    false,
    'draft',
    '2023-04-20'
  );
