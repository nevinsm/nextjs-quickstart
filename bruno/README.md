# Bruno API Collection

Collection root: `bruno/`

## Requests included

- `POST /api/ai` -> `bruno/api/ai_post.bru`
- `POST /auth/session` -> `bruno/auth/session_post.bru`
- `DELETE /auth/session` -> `bruno/auth/session_delete.bru`

## Local setup

1. Open the `bruno/` folder in Bruno.
2. Select environment `Local`.
3. Set `accessToken` in `bruno/environments/Local.bru` before calling `POST /auth/session`.
4. Start app locally (`pnpm dev`) and run requests.
