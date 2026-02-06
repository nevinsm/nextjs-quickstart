-- Creates a starter projects table scoped to authenticated users.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.projects enable row level security;

-- Owners can read only their own rows.
create policy "Users can select their own projects"
  on public.projects
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Owners can insert only rows tied to their auth.uid().
create policy "Users can insert their own projects"
  on public.projects
  for insert
  to authenticated
  with check (auth.uid() = user_id);
