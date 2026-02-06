# Repository Guidelines

## Project Structure & Module Organization
Core app code lives in `src/` using Next.js App Router:
- `src/app/`: routes, layouts, API handlers (for example `src/app/api/ai/route.ts`).
- `src/features/`: feature modules (`projects`, `uploads`) with `types.ts`, `validation.ts`, `data-access.ts`, `actions.ts`, and UI components.
- `src/components/`: shared UI and app shell components.
- `src/lib/`: Supabase and auth utilities.

Supporting directories:
- `supabase/migrations/`: SQL schema and RLS policies (timestamped, applied in order).
- `docs/`: onboarding, deployment, and feature workflow docs.
- `bruno/`: API request collections for local testing.

## Build, Test, and Development Commands
- `pnpm install`: install dependencies (Node `>=24`, pnpm `>=10`).
- `pnpm dev`: run local dev server at `http://localhost:3000`.
- `pnpm lint`: run ESLint across the repository.
- `pnpm typecheck`: run TypeScript checks without emit.
- `pnpm build`: production build verification.
- `pnpm format`: apply Prettier formatting.

Before opening a PR, run: `pnpm lint && pnpm typecheck && pnpm build`.

## Coding Style & Naming Conventions
Use TypeScript-first, App Router-first patterns, and keep server components as default unless client interactivity is required.
- Formatting: Prettier (`.prettierrc.cjs`), 2-space indentation.
- Linting: ESLint (`eslint.config.mjs`, Next.js rules).
- Naming: kebab-case for route and component filenames (`sign-in-form.tsx`), camelCase for variables/functions, PascalCase for React components/types.
- Validation: all external inputs should be validated with `zod`.

## Testing Guidelines
There is no dedicated unit/integration test suite yet. Quality gates are:
1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm build`

For behavior checks, validate auth, dashboard CRUD, uploads, and `/api/ai` flows locally. Use Bruno requests in `bruno/` for API checks.

## Commit & Pull Request Guidelines
Follow Conventional Commits, as used in history:
- `feat(projects): add reusable CRUD module`
- `ci(workflow): cache next build artifacts`

PRs should include:
- Clear summary and scope.
- Linked issue (if applicable).
- Notes for env vars, migrations, or auth callback changes.
- Screenshots/GIFs for UI changes.
