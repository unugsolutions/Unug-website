-- ============================================================
-- UNUG — Remove blog (blog feature removed from the website)
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query)
-- ============================================================

-- 1. Storage policies for the blog bucket
drop policy if exists "blog_public_read" on storage.objects;
drop policy if exists "blog_auth_read" on storage.objects;
drop policy if exists "blog_auth_insert" on storage.objects;
drop policy if exists "blog_auth_update" on storage.objects;
drop policy if exists "blog_auth_delete" on storage.objects;

-- 2. Blog cover images + the bucket itself.
--    Direct deletes are blocked by storage.protect_delete() unless the
--    session config below is set (same mechanism the Storage API uses).
begin;

select set_config('storage.can_delete', 'true', true);
select set_config('storage.allow_delete_query', 'true', true);

delete from storage.objects where bucket_id = 'blog';
delete from storage.buckets where id = 'blog';

commit;

-- 3. Blog posts table (drops its RLS policies, trigger and indexes too)
drop table if exists public.blog_posts;
