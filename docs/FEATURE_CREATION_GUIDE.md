# Feature Creation Guide

A minimal, repeatable implementation pattern for shipping hackathon features quickly.

## Feature folder pattern

Create `src/features/<feature>/` with:

- `types.ts`: shared TypeScript types
- `validation.ts`: zod request/input schemas
- `data-access.ts`: Supabase data access helpers
- `actions.ts`: server actions (write operations)
- `components/*`: UI pieces
- `hooks/*` (optional): client state helpers

Keep route wiring in `src/app/*` and keep feature logic in `src/features/*`.

## Delivery checklist

1. Define zod schema(s) in `validation.ts`.
2. Add/adjust data layer in `data-access.ts`.
3. Implement writes in server actions.
4. Render from server components first.
5. Use client components only where interactivity is required.
6. Add Supabase migration when schema/RLS/storage changes are needed.
7. Validate end-to-end manually.
8. Run quality gates.

## Supabase changes

When a feature needs DB/storage changes:

1. Add migration under `supabase/migrations/`.
2. Enable/adjust RLS policies for least privilege.
3. Keep ownership checks explicit (`auth.uid()` pattern).
4. Document migration intent briefly in `supabase/migrations/README.md`.

## Environment variables

If a feature needs new env vars:

1. Add zod validation in `src/env.ts` (or route-local schema when route-specific).
2. Add placeholder to `.env.example`.
3. Document variable in `README.md`.
4. Add value in Vercel project settings for deploy environments.

## Quality gates

Run before merge:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Suggested review questions

- Are all inputs validated with zod?
- Are server-only secrets kept out of `NEXT_PUBLIC_*`?
- Are RLS policies least-privilege and owner-scoped?
- Is the feature mostly server components?
- Are docs updated for any onboarding impact?
