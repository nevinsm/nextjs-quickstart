# Onboarding Runbook

This runbook is for new contributors joining the repository.

## Goal

Get from clone to a running app quickly, with Supabase connected and deployment-ready checks passing.

## Prerequisites

- Node.js `>=24`
- pnpm `>=10`
- Git
- Supabase account/project

Optional local-only stack:

- Supabase CLI (`supabase --version`)
- Docker Desktop (required by local Supabase)

## 1) Clone and install

```bash
git clone <your-repo-url>
cd next-base
pnpm install
```

## 2) Configure environment

Create local env file from template:

```bash
cp .env.example .env
```

Set these required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_SECRET_KEY`

Optional AI tuning:

- `AI_RATE_LIMIT_WINDOW_SECONDS`
- `AI_RATE_LIMIT_MAX_REQUESTS`

## 3) Prepare Supabase

### Hosted Supabase (recommended)

1. Create project in Supabase dashboard.
2. Copy URL + publishable key from `Project Settings -> API`.
3. Run SQL in `supabase/migrations/*.sql` in timestamp order.
4. Configure auth URLs:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/auth/callback`

### Local Supabase (optional)

```bash
supabase start
```

Then use local API URL and anon key from CLI output. If Docker is unavailable, use hosted Supabase.

## 4) Run app

```bash
pnpm dev
```

Open `http://localhost:3000`.

## 5) Verify core flows

1. Open `/auth/sign-in` and create/sign in with a user.
2. Confirm `/dashboard` is accessible when authenticated.
3. Create a project in dashboard and verify it appears in list.
4. Upload a file and confirm a public URL appears.
5. POST to `/api/ai` with valid payload and confirm scaffold response.

## 6) Run quality gates

```bash
pnpm lint
pnpm typecheck
pnpm build
```

If Turbopack build fails in a restricted environment (OS-level process/port limits), run:

```bash
pnpm exec next build --webpack
```

## 7) Deploy readiness

Before opening a PR or deploying:

- Env vars configured
- Migrations applied
- Auth callback URLs configured
- `lint`, `typecheck`, and `build` passing

Use `docs/VERCEL_DEPLOYMENT.md` for production deployment steps.
