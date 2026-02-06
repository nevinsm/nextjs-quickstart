# Supabase Migrations

## 20260206120000_create_projects_table.sql

Creates `public.projects` with:

- `id` (`uuid`, primary key, default `gen_random_uuid()`)
- `user_id` (`uuid`, default `auth.uid()`, FK to `auth.users`)
- `name` (`text`, non-empty)
- `created_at` (`timestamptz`, UTC default)

Enables RLS and adds owner-only policies for `SELECT` and `INSERT`.

## 20260206123000_optimize_projects_rls.sql

Recreates `projects` RLS policies to use `(select auth.uid())` instead of `auth.uid()` directly in policy predicates to avoid per-row function re-evaluation and improve performance at scale.

## Uploads storage notes

See `supabase/migrations/uploads-storage-notes.md` for SQL that creates the `uploads` bucket and owner-scoped insert policy for `storage.objects`.

## 20260206124500_create_uploads_bucket.sql

Creates or updates the public `uploads` storage bucket and adds an `INSERT` policy on `storage.objects` so authenticated users can only upload into their own user-id-prefixed folder.
