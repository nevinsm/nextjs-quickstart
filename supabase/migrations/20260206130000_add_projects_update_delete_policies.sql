-- Adds missing RLS policies so project owners can update and delete their own rows.
drop policy if exists "Users can update their own projects" on public.projects;
drop policy if exists "Users can delete their own projects" on public.projects;

create policy "Users can update their own projects"
  on public.projects
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own projects"
  on public.projects
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
