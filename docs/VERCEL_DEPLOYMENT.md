# Vercel Deployment Guide

This project is compatible with Vercel as-is (Next.js App Router + TypeScript).

## Required Environment Variables

Set these in your Vercel project (`Settings -> Environment Variables`) for `Production` (and `Preview` if needed):

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (for example `https://<project-ref>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Yes | Supabase publishable/anon key used by browser and server clients. |

These are validated at runtime in `src/env.ts`.

## Supabase Auth Configuration (Required for Auth After Deploy)

In Supabase Dashboard (`Authentication -> URL Configuration`):

1. Set **Site URL** to your Vercel production domain (for example `https://your-app.vercel.app`).
2. Add this redirect URL:
   - `https://your-app.vercel.app/auth/callback`
3. If you use preview deployments, add preview callback URLs as additional redirect URLs.

Without this, email confirmation and callback auth flows will fail in production.

## Deploy to Vercel

1. Push your repository to GitHub/GitLab/Bitbucket.
2. Import the repo in Vercel.
3. Keep default framework detection (`Next.js`).
4. Add the required environment variables listed above.
5. Deploy.

## Post-Deploy Verification

1. Open `/auth/sign-in` on the deployed app.
2. Run sign-up and sign-in with a test user.
3. Confirm successful redirect to `/dashboard`.
4. Confirm session persists on refresh.

## Local Production Check

Run the same checks used for deployment readiness:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

