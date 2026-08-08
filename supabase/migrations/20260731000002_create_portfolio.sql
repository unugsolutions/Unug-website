-- ============================================================
-- UNUG — Portfolio table + Row Level Security + Storage bucket
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query)
-- NOTE: this is independent of the services migration, but the
-- set_updated_at() function is re-created here to be self-sufficient.
-- ============================================================

-- Portfolio projects table
create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'Web App',
  client text,
  short_description text not null,
  description text not null,
  challenge text,
  solution text,
  result text,
  cover_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  technologies jsonb not null default '[]'::jsonb,
  project_url text,
  demo_url text,
  display_order integer not null default 0,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table public.portfolio enable row level security;

-- Public visitors can only read published projects
create policy "portfolio_public_read"
  on public.portfolio for select
  to anon
  using (status = 'published');

-- Authenticated administrators can read every project (including drafts)
create policy "portfolio_auth_read_all"
  on public.portfolio for select
  to authenticated
  using (true);

-- Only authenticated administrators can write
create policy "portfolio_auth_insert"
  on public.portfolio for insert
  to authenticated
  with check (true);

create policy "portfolio_auth_update"
  on public.portfolio for update
  to authenticated
  using (true);

create policy "portfolio_auth_delete"
  on public.portfolio for delete
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

drop trigger if exists portfolio_set_updated_at on public.portfolio;
create trigger portfolio_set_updated_at
  before update on public.portfolio
  for each row
  execute function public.set_updated_at();

-- Indexes
create index if not exists portfolio_status_idx on public.portfolio (status);
create index if not exists portfolio_featured_idx on public.portfolio (featured);
create index if not exists portfolio_display_order_idx on public.portfolio (display_order);

-- ============================================================
-- Storage: public "portfolio" bucket (cover-images/ and gallery/)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio',
  'portfolio',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
on conflict (id) do nothing;

-- Anyone can view project images
create policy "portfolio_public_read"
  on storage.objects for select
  to anon
  using (bucket_id = 'portfolio');

create policy "portfolio_auth_read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'portfolio');

-- Only authenticated administrators can upload and manage images
create policy "portfolio_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio');

create policy "portfolio_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio');

create policy "portfolio_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio');

-- ============================================================
-- Seed data (cover images are uploaded via the admin dashboard,
-- the public site falls back to brand gradients until then)
-- ============================================================
insert into public.portfolio
  (title, slug, category, client, short_description, description, challenge, solution, result, technologies, project_url, demo_url, display_order, featured, status)
values
  (
    'FinFlow Platform',
    'finflow-platform',
    'Web App',
    'FinFlow Ltd',
    'A financial dashboard for real-time analytics and reporting.',
    'A comprehensive financial dashboard built for real-time analytics, reporting, and business intelligence. The platform processes millions of transactions daily, providing CFOs and finance teams with instant visibility into cash flow, revenue trends, and financial health.',
    'Finance teams relied on manual spreadsheets that were slow to update and prone to error, delaying critical reporting decisions.',
    'We designed and built a live analytics platform with real-time data streams, automated report generation, and deep integrations with popular accounting tools.',
    'Reporting time dropped from days to minutes and leadership gained instant, accurate visibility into company financial health.',
    '["React", "Node.js", "PostgreSQL", "AWS", "Redis"]',
    'https://finflow.example.com',
    NULL,
    1,
    true,
    'published'
  ),
  (
    'ShopNex E-Commerce',
    'shopnex-e-commerce',
    'E-Commerce',
    'ShopNex',
    'Scalable e-commerce platform with AI-powered recommendations.',
    'A scalable, AI-powered e-commerce platform that handles thousands of concurrent users. Features intelligent product recommendations, dynamic pricing, and a seamless checkout experience that increased conversion rates by 35%.',
    'A growing retailer needed a storefront capable of handling seasonal traffic spikes without sacrificing speed or conversion.',
    'We built a modern storefront with AI-powered recommendations, a dynamic pricing engine, and a frictionless one-click checkout experience.',
    'The platform scaled effortlessly through peak seasons and increased conversion rates by 35%.',
    '["Next.js", "Python", "MongoDB", "Stripe", "Docker"]',
    'https://shopnex.example.com',
    NULL,
    2,
    true,
    'published'
  ),
  (
    'HealthTrack Mobile',
    'healthtrack-mobile',
    'Mobile App',
    'HealthTrack',
    'Cross-platform health monitoring and appointment management app.',
    'A cross-platform mobile application for health monitoring, appointment management, and telemedicine. Connects patients with healthcare providers, manages medical records, and provides real-time health tracking.',
    'Patients struggled to book appointments and track their health, while providers lacked a unified channel for follow-ups.',
    'We shipped a cross-platform app with appointment scheduling, video consultations, and secure health-metric tracking for both patients and providers.',
    'Patient engagement improved and clinics reduced no-shows through automated reminders and seamless communication.',
    '["React Native", "Firebase", "Twilio", "GraphQL"]',
    'https://healthtrack.example.com',
    NULL,
    3,
    false,
    'published'
  ),
  (
    'CloudSync System',
    'cloudsync-system',
    'System',
    'CloudSync Inc',
    'Enterprise cloud synchronization and backup infrastructure.',
    'An enterprise-grade cloud synchronization and backup infrastructure designed for organizations with distributed teams. Ensures data consistency across locations with military-grade encryption.',
    'A distributed organization needed reliable file synchronization and backup across multiple office locations.',
    'We architected a secure cloud synchronization and backup infrastructure with automated scheduling and end-to-end encryption.',
    'Data is now consistent across every location, with automated, verifiable backups protecting critical business files.',
    '["Go", "AWS S3", "Kafka", "Kubernetes", "Terraform"]',
    NULL,
    NULL,
    4,
    false,
    'published'
  ),
  (
    'DesignPro Studio',
    'designpro-studio',
    'UI/UX Design',
    'DesignPro',
    'Complete design system and component library for a SaaS product.',
    'A complete design system and component library built for a SaaS product team. Includes 200+ reusable components, design tokens, and comprehensive documentation that accelerated development velocity by 40%.',
    'A SaaS team was rebuilding the same UI patterns repeatedly, slowing product development and hurting consistency.',
    'We created a full design system with 200+ reusable components, design tokens, and interactive documentation tied directly to the codebase.',
    'Development velocity accelerated by 40% and every screen now ships with a consistent, polished look and feel.',
    '["React", "Storybook", "Tailwind CSS", "Figma API"]',
    'https://designpro.example.com',
    NULL,
    5,
    false,
    'published'
  ),
  (
    'DataPipe API',
    'datapipe-api',
    'API',
    'DataPipe',
    'High-throughput API gateway connecting 20+ microservices.',
    'A high-throughput API gateway connecting 20+ internal and external microservices. Handles 10M+ daily requests with sub-50ms latency and provides comprehensive monitoring, rate limiting, and authentication.',
    'The engineering team needed a unified gateway to secure, route, and monitor traffic across 20+ microservices.',
    'We delivered an API gateway with rate limiting, service mesh integration, and real-time monitoring that scales automatically.',
    'The gateway now handles 10M+ daily requests with sub-50ms latency and a single point of control for authentication and traffic.',
    '["Node.js", "Envoy", "Prometheus", "Grafana", "Docker"]',
    NULL,
    NULL,
    6,
    false,
    'published'
  )
on conflict (slug) do nothing;
