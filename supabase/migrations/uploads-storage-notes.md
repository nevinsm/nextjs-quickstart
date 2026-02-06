# Uploads Storage Bucket Notes

Use this SQL in Supabase SQL Editor (or as a future migration) to create the `uploads` bucket and owner-only write access.

```sql
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = excluded.public;

create policy "authenticated can upload own files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'uploads'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
```

If files should be private, set `public` to `false` and return signed URLs from the server instead of `getPublicUrl`.
