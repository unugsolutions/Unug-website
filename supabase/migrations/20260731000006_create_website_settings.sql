-- Website Settings — global CMS single row
-- Single source of truth for company info, branding, SEO, contact, social, footer, colors.

create extension if not exists pgcrypto;

-- Single-row settings table (one row controls the whole website)
create table if not exists public.website_settings (
  id uuid primary key default gen_random_uuid(),
  company_name text,
  company_tagline text,
  company_description text,
  mission text,
  vision text,
  email text,
  phone text,
  whatsapp text,
  website text,
  address text,
  city text,
  country text,
  google_maps_url text,
  logo_url text,
  favicon_url text,
  primary_color text,
  secondary_color text,
  accent_color text,
  facebook_url text,
  linkedin_url text,
  instagram_url text,
  x_url text,
  youtube_url text,
  github_url text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  google_analytics_id text,
  google_tag_manager_id text,
  meta_image text,
  maintenance_mode boolean not null default false,
  footer_text text,
  copyright_text text,
  business_hours text,
  quick_links jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

drop trigger if exists set_website_settings_updated_at on public.website_settings;
create trigger set_website_settings_updated_at
  before update on public.website_settings
  for each row
  execute function public.set_updated_at();

-- Seed the single settings row (do nothing if already seeded)
insert into public.website_settings (
  id,
  company_name,
  company_tagline,
  company_description,
  mission,
  vision,
  email,
  phone,
  whatsapp,
  website,
  address,
  city,
  country,
  google_maps_url,
  primary_color,
  secondary_color,
  accent_color,
  seo_title,
  seo_description,
  seo_keywords,
  maintenance_mode,
  footer_text,
  copyright_text,
  business_hours
) values (
  '00000000-0000-0000-0000-000000000001',
  'UNUG Solutions',
  'Engineering Digital Solutions',
  'Engineering Digital Solutions for a Smarter Tomorrow. We build modern websites, software, and platforms that drive business growth.',
  'To empower businesses and organizations through innovative, reliable, and scalable digital solutions that solve real-world challenges and create lasting value.',
  'To become one of the leading software engineering and digital transformation companies in Somaliland and East Africa, recognized for innovation, quality, and customer success.',
  'unugsolutions@gmail.com',
  '+252 63 837 4348',
  'https://web.whatsapp.com/',
  'https://unugsolutions.com',
  'Hargeisa, Somaliland',
  'Hargeisa',
  'Somaliland',
  '',
  '#2563EB',
  '#0F172A',
  '#FF8C00',
  'UNUG Solutions | Engineering Digital Solutions',
  'UNUG Solutions is a software engineering and digital solutions company. We build modern websites, custom software, mobile apps, and digital platforms that drive business growth.',
  'software development, web development, mobile apps, UI/UX design, digital solutions, UNUG, Somaliland',
  false,
  'Engineering Digital Solutions for a Smarter Tomorrow.',
  'All rights reserved.',
  'Monday – Saturday: 9:00 AM – 6:00 PM'
)
on conflict (id) do nothing;

-- Row Level Security
alter table public.website_settings enable row level security;

drop policy if exists "Public can read website settings" on public.website_settings;
create policy "Public can read website settings"
  on public.website_settings
  for select
  using (true);

drop policy if exists "Authenticated admins can manage website settings" on public.website_settings;
create policy "Authenticated admins can manage website settings"
  on public.website_settings
  for all
  to authenticated
  using (true)
  with check (true);

-- Keep the settings row synchronized across the site
alter publication supabase_realtime add table public.website_settings;

-- Storage bucket for logo / favicon / seo images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-assets',
  'website-assets',
  true,
  10485760,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/avif'
  ]
)
on conflict (id) do nothing;

drop policy if exists "Public read website-assets" on storage.objects;
create policy "Public read website-assets"
  on storage.objects
  for select
  using (bucket_id = 'website-assets');

drop policy if exists "Authenticated upload website-assets" on storage.objects;
create policy "Authenticated upload website-assets"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'website-assets');

drop policy if exists "Authenticated update website-assets" on storage.objects;
create policy "Authenticated update website-assets"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'website-assets');

drop policy if exists "Authenticated delete website-assets" on storage.objects;
create policy "Authenticated delete website-assets"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'website-assets');
