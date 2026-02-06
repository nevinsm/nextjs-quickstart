do $$
declare
  seeded_user_id uuid;
begin
  select id
  into seeded_user_id
  from auth.users
  where email = 'test@example.com'
  limit 1;

  if seeded_user_id is null then
    seeded_user_id := gen_random_uuid();

    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      email_change_token_current,
      reauthentication_token,
      raw_app_meta_data,
      raw_user_meta_data,
      phone_change,
      phone_change_token,
      email_change_confirm_status,
      is_sso_user,
      is_anonymous,
      created_at,
      updated_at
    )
    values (
      seeded_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'test@example.com',
      extensions.crypt('!password', extensions.gen_salt('bf')),
      now(),
      '',
      '',
      '',
      '',
      '',
      '',
      '{"provider":"email","providers":["email"]}',
      '{}',
      '',
      '',
      0,
      false,
      false,
      now(),
      now()
    );
  else
    update auth.users
    set
      encrypted_password = extensions.crypt('!password', extensions.gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      confirmation_token = coalesce(confirmation_token, ''),
      recovery_token = coalesce(recovery_token, ''),
      email_change_token_new = coalesce(email_change_token_new, ''),
      email_change = coalesce(email_change, ''),
      email_change_token_current = coalesce(email_change_token_current, ''),
      reauthentication_token = coalesce(reauthentication_token, ''),
      phone_change = coalesce(phone_change, ''),
      phone_change_token = coalesce(phone_change_token, ''),
      raw_app_meta_data = coalesce(raw_app_meta_data, '{"provider":"email","providers":["email"]}'::jsonb),
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb),
      email_change_confirm_status = coalesce(email_change_confirm_status, 0),
      updated_at = now()
    where id = seeded_user_id;
  end if;

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    seeded_user_id,
    jsonb_build_object(
      'sub', seeded_user_id::text,
      'email', 'test@example.com'
    ),
    'email',
    'test@example.com',
    now(),
    now()
  )
  on conflict (provider_id, provider) do update
  set
    user_id = excluded.user_id,
    identity_data = excluded.identity_data,
    updated_at = now();
end
$$;
