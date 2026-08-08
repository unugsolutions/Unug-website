# UNUG Solutions — Website

Modern website + admin dashboard for **UNUG Solutions**, built with React, Vite, Tailwind CSS, and Supabase.

## Tech Stack

- **React 19** + **react-router-dom 7** — SPA with code-split lazy routes
- **Vite 8** — build tool
- **Tailwind CSS v3** — styling
- **framer-motion** — animations
- **Supabase** (Postgres + Auth + Storage + RLS) — backend
- **React Hook Form + Zod** — forms & validation
- **react-hot-toast** — notifications
- **lucide-react** — icons
- **oxlint** — linting

## Project Structure

```
src/
  components/          # Shared/public UI (Navbar, Footer, cards, layout)
    dashboard/         # Dashboard UI (tables, forms, modals, settings)
  pages/               # Public pages (Home, Services, Solutions, About, Team,
                       #   Contact, RequestDemo, Testimonials, Login…)
  pages/dashboard/     # Admin pages (Dashboard, Services, Portfolio, Testimonials,
                       #   Messages, Quotes, Team, Settings, Profile)
  routes/AppRoutes.jsx # Route table (lazy-loaded, Suspense)
  services/            # Supabase data layer (services, portfolio, testimonials,
                       #   team, quotes, messages, settings, storage, auth)
  hooks/               # Data hooks (useWebsiteSettings, useTeam, useQuotes…)
  context/             # AuthContext (Supabase session)
  utils/               # seo.js (per-page SEO/OG), notes.js helpers
  lib/                 # supabaseClient, serviceIcons, socialIcons
public/                # Static assets (logos, robots.txt, sitemap.xml, manifest.json)
supabase/migrations/   # SQL migrations (run manually in Supabase, in order)
```

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values from your Supabase project
(**Settings → API**).

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL, e.g. `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public anon key (safe to expose in the browser) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Optional fallback (newer publishable key) |

> `*.local` files are gitignored. **Never commit secrets.**

## Supabase Setup

1. Create a project at https://supabase.com.
2. Open **SQL Editor** and run every migration in `supabase/migrations/` **in filename
   order** (`20260731000001_…` → `20260805000012_…`).
   Migrations create tables, RLS policies, storage buckets, RPC functions, triggers,
   and seed data. The publishable key cannot run DDL — run them manually.
3. In **Authentication → Users**, create the admin user (email + password) you will
   sign in with at `/login`.

### RLS Model

- Anonymous visitors: read published content only; submit quote requests via the
  security-definer `submit_quote_request` RPC (no anonymous SELECT on the table).
- Authenticated (admin): full CRUD on all admin tables.
- Storage buckets (`public`, `team`, `content`): public read of published assets;
  uploads restricted to authenticated users.

### Storage Buckets

Migrations create buckets. If you need to recreate them manually:

- `public` — 10 MB, image/* MIME types (site images, portfolio, testimonials, team)
- `team` — 10 MB, image/* (team photos, created by the team migration)
- `content` — 10 MB, image/* (content assets)

## Deploying to Vercel

1. Push the repo to GitHub, then import it in Vercel.
2. Framework preset: **Vite** (build `npm run build`, output `dist`).
3. Add production environment variables (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY`).
4. Connect the custom domain `unugsolutions.online` (add both `www` and apex) and
   enable HTTPS/SSL with automatic renewal.
5. `vercel.json` already configures:
   - SPA rewrites (deep links served by `index.html`)
   - Security headers (CSP, X-Frame-Options, HSTS, Referrer-Policy, …)
   - Cache headers (immutable hashed assets, short TTL for HTML/static SEO files)

## Checklist Before Deploy

- [ ] Run all migrations in Supabase SQL Editor (00001 → 00012)
- [ ] Create the admin user in Supabase Auth
- [ ] Set production env vars in Vercel
- [ ] Attach `unugsolutions.online` (and www) with HTTPS
- [ ] `npm run lint` clean
- [ ] `npm run build` passes
- [ ] Verify: console clean, all routes, auth, dashboard CRUD, image uploads, quote
      request flow, responsive layout

## Scripts

```bash
npm run dev        # dev server (HMR)
npm run build      # production build (code-split)
npm run preview    # preview production build locally
npm run lint       # oxlint
```

## Troubleshooting

- **Blank page on first load** — make sure `useWebsiteSettings`/social icons handle a
  `null` settings object (see `src/lib/socialIcons.js`).
- **Tables missing / RLS errors** — run the migrations again in order in Supabase.
- **Uploads fail** — confirm the storage bucket exists and storage RLS policies are in
  place, and that you're signed in for admin uploads.
- **Quote reference not returned** — the `submit_quote_request` RPC returns the new
  `reference`; if missing, check the `site_config` `quote_prefix` / `quote_start_number`.

## Backup / Recovery

- Supabase: Database → Backups (enable scheduled backups).
- Storage: download bucket contents via the Storage dashboard.
- Env vars: store a copy of `.env.local` (or Vercel env vars) in a safe place.
