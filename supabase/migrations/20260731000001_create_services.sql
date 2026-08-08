-- ============================================================
-- UNUG — Services table + Row Level Security
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query)
-- ============================================================

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  description text not null,
  icon text not null default 'Code2',
  image_url text,
  features jsonb not null default '[]'::jsonb,
  display_order integer not null default 0,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table public.services enable row level security;

-- Public visitors can only read published services
create policy "services_public_read"
  on public.services for select
  to anon
  using (status = 'published');

-- Authenticated administrators can read every service (including drafts)
create policy "services_auth_read_all"
  on public.services for select
  to authenticated
  using (true);

-- Only authenticated administrators can write
create policy "services_auth_insert"
  on public.services for insert
  to authenticated
  with check (true);

create policy "services_auth_update"
  on public.services for update
  to authenticated
  using (true);

create policy "services_auth_delete"
  on public.services for delete
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

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row
  execute function public.set_updated_at();

-- Indexes
create index if not exists services_status_idx on public.services (status);
create index if not exists services_display_order_idx on public.services (display_order);

-- Seed data
insert into public.services
  (title, slug, short_description, description, icon, features, display_order, featured, status)
values
  (
    'Website Design & Development',
    'website-design-development',
    'Modern, responsive websites that establish your online presence and drive growth.',
    'We design and build fast, secure, and responsive websites tailored to your brand. From business websites and corporate portals to full e-commerce platforms, every site is engineered for performance, SEO, and a seamless user experience.',
    'Globe',
    '["Business Websites", "Corporate Portals", "E-Commerce Platforms", "Landing Pages", "Portfolio Websites", "Website Maintenance"]',
    1,
    false,
    'published'
  ),
  (
    'Custom Software Development',
    'custom-software-development',
    'Tailored business applications built around your specific workflows and requirements.',
    'We develop custom software that automates your operations and solves real business problems. Our systems are built to scale with your organization and integrate seamlessly with your existing tools.',
    'Code2',
    '["Business Management Systems", "School Management Systems", "Hospital Management Systems", "Enterprise Systems", "POS & Inventory Systems", "HR & Payroll Systems"]',
    2,
    true,
    'published'
  ),
  (
    'Mobile Application Development',
    'mobile-application-development',
    'Beautiful and scalable Android and iOS applications for your business.',
    'We build native and cross-platform mobile applications that deliver a polished, high-performance experience on every device. From concept to store launch, we handle the entire mobile journey.',
    'Smartphone',
    '["Android Apps", "iOS Apps", "Cross-Platform (Flutter)", "API Integration", "App Maintenance", "Database Integration"]',
    3,
    false,
    'published'
  ),
  (
    'UI/UX Design',
    'ui-ux-design',
    'User-centered interfaces designed for exceptional digital experiences.',
    'Our designers craft intuitive, accessible, and beautiful interfaces grounded in research. We turn complex ideas into clear, delightful user journeys for web and mobile products.',
    'PencilRuler',
    '["Wireframing & Prototyping", "Dashboard Design", "Mobile UI Design", "Web UI Design", "Design Systems", "User Experience Research"]',
    4,
    false,
    'published'
  ),
  (
    'Cloud Solutions & Database Design',
    'cloud-solutions-database-design',
    'Scalable cloud infrastructure and reliable database architecture.',
    'We architect cloud environments and databases that are secure, reliable, and cost-efficient. Your infrastructure is designed to handle growth without compromising performance.',
    'Cloud',
    '["Cloud Deployment", "Database Design", "Server Configuration", "Security Solutions", "API Integration", "Performance Optimization"]',
    5,
    false,
    'published'
  ),
  (
    'System Maintenance & IT Consulting',
    'system-maintenance-it-consulting',
    'Reliable technical support and strategic technology consulting.',
    'We keep your systems running smoothly with proactive maintenance and support, and help you plan your technology roadmap with practical, business-focused IT consulting.',
    'Database',
    '["System Maintenance", "Technical Support", "Digital Strategy", "IT Consulting", "Technology Planning", "Business Automation"]',
    6,
    false,
    'published'
  )
on conflict (slug) do nothing;
