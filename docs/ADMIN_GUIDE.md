# Admin guide

## Access

Sign in with an **ADMIN** account (dev: `admin@cuisenio.com` / `Admin@2024!`).

You are redirected to `/dashboard`. Non-admins visiting `/dashboard` are redirected to `/home`.

## Capabilities

| Action | Description |
|--------|-------------|
| Overview metrics | User / recipe / category counts |
| List users | Inspect registration and status |
| Block / unblock | Prevent login for abusive accounts |
| Delete user | Permanent removal |

## Moderation practices

1. Prefer **block** over delete when investigating.
2. Review recipe reports from the community (when wired to backend).
3. Keep demo admin credentials out of production.

## Security notes

- JWT still valid until expiry after a block — shorter token TTL or a deny-list is recommended for production.
- Category/ingredient mutation is currently available to any authenticated user — tighten to admin-only for production.
