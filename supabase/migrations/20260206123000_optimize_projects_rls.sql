-- Optimizes RLS policy expressions to avoid per-row auth.uid() re-evaluation.
drop policy if exists "Users can select their own projects" on public.projects;
drop policy if exists "Users can insert their own projects" on public.projects;

create policy "Users can select their own projects"
  on public.projects
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own projects"
  on public.projects
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
