# next-base

A production-oriented hackathon starter built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Overview

This template gives you a ready baseline for shipping fast:

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui primitives
- Supabase auth, database, and storage examples
- AI route scaffold with request validation and Supabase-backed rate limiting
- Vercel-compatible deployment flow

Current app routes:

- `/` landing page
- `/auth/sign-in` authentication page
- `/auth/callback` auth callback handler page
- `/dashboard` protected page with projects + uploads examples
- `/api/ai` AI scaffold endpoint (`501` fallback by default)

## Quick Start (15-minute path)

Prerequisites:

- Node.js `>=24`
- pnpm `>=10`
- Supabase project (hosted) or local Supabase CLI setup

1. Install dependencies.

```bash
pnpm install
```

2. Set environment variables.

```bash
cp .env.example .env
```

Then provide real values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_SECRET_KEY`

3. Start the app.

```bash
pnpm dev
```

4. Open `http://localhost:3000`.

5. Optional quality checks before commit/deploy.

```bash
pnpm lint
pnpm typecheck
pnpm build
```

If `pnpm build` runs in a restricted local environment and Turbopack errors with OS-level port/process limits, use:

```bash
pnpm exec next build --webpack
```

## Supabase Setup

Use hosted Supabase (fastest for hackathons):

1. Create a Supabase project in the dashboard.
2. Copy project URL and publishable (anon) key from `Project Settings -> API`.
3. Set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
4. Create a server key for rate limiting and set:
   - `SUPABASE_SECRET_KEY`
5. Run SQL migrations from `supabase/migrations/*.sql` in order (SQL Editor).

Required migration outcomes:

- `public.projects` table with RLS policies (`select`, `insert`, `update`, `delete` owner-scoped)
- `uploads` storage bucket with owner-scoped insert policy
- `public.ai_rate_limit_events` table with `service_role` policy

Auth URL config in Supabase (`Authentication -> URL Configuration`):

- Site URL: `http://localhost:3000` (local), later update to production domain
- Redirect URL: `http://localhost:3000/auth/callback`

For detailed deployment-specific auth settings, see `docs/VERCEL_DEPLOYMENT.md`.

## Vercel Deploy

1. Push repository to Git provider.
2. Import project in Vercel.
3. Add required env vars in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
   - `SUPABASE_SECRET_KEY` (required for `/api/ai` rate limiter)
4. Deploy.
5. Update Supabase auth configuration:
   - Site URL: `https://<your-vercel-domain>`
   - Redirect URL: `https://<your-vercel-domain>/auth/callback`

Post-deploy verification:

- Sign in from `/auth/sign-in`
- Confirm redirect to `/dashboard`
- Create a project row
- Upload a file
- Confirm `/api/ai` returns scaffolded response

Full deployment notes: `docs/VERCEL_DEPLOYMENT.md`.

## Feature Creation Guide

Use this repeatable pattern for hackathon features:

1. Create `src/features/<feature>/` with:
   - `types.ts`
   - `validation.ts` (zod schemas)
   - `data-access.ts` (Supabase access)
   - `actions.ts` (server actions)
   - `components/*` (UI)
2. Validate all new inputs with zod.
3. Keep server components as default; add client components only for interactivity.
4. Add or update Supabase SQL migration for schema/RLS/storage policy changes.
5. Wire route/page usage in `src/app/*`.
6. Run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Detailed guide: `docs/FEATURE_CREATION_GUIDE.md`.

## Environment Variables

All environment values are validated with zod (`src/env.ts` and route-level schemas).

| Variable | Required | Used by | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | App + API | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Yes | App + API | Supabase publishable (anon) key for browser and server clients. |
| `SUPABASE_SECRET_KEY` | Yes for `/api/ai` | `src/app/api/ai/route.ts` | Server-only key for Supabase-backed rate-limit writes/queries. |
| `AI_RATE_LIMIT_WINDOW_SECONDS` | Optional | `src/app/api/ai/route.ts` | Rate-limit window (default `60`). |
| `AI_RATE_LIMIT_MAX_REQUESTS` | Optional | `src/app/api/ai/route.ts` | Max requests per identifier per window (default `10`). |

Notes:

- Never commit real secrets.
- Do not put server-only keys in `NEXT_PUBLIC_*` variables.
- `.env.example` intentionally includes placeholders only.

## Documentation Index

- `docs/ONBOARDING.md` full onboarding runbook
- `docs/FEATURE_CREATION_GUIDE.md` feature delivery workflow
- `docs/VERCEL_DEPLOYMENT.md` deployment and auth callback setup
- `docs/ai.md` AI scaffold integration details
