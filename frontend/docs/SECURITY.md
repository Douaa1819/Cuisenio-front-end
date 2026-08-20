# Security report

## Summary

Cuisenio now applies defense-in-depth for a JWT SPA + API. Critical privilege escalation on register is **fixed**. Remaining gaps are documented below with severity.

---

## Fixes applied

| Issue | Severity | Fix |
|-------|----------|-----|
| Client could register as `ADMIN` | **Critical** | Removed `role` from `RegisterRequest`; `AuthServiceImpl` forces `Role.USER` |
| JWT secret committed in yaml | **High** | Moved to `${JWT_SECRET}` with non-production default |
| Password hash logged on login | **Medium** | Removed `System.out.println(user)` in `UserDetailsServiceImpl` |
| Unrestricted file uploads | **High** | MIME + extension whitelist, size cap, UUID filenames, path traversal guard |
| CORS hardcoded only to localhost | **Medium** | Configurable `CORS_ALLOWED_ORIGINS` |
| Missing security headers | **Medium** | XSS, frame deny, nosniff, referrer, permissions-policy |
| Destructive `ddl-auto: create` | **High** | Default `update`; prod guidance `validate` |
| Demo seeder always on | **Low** | Feature flag `CUISENIO_SEED_ENABLED` |

---

## Remaining vulnerabilities / risks

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| No refresh tokens / revocation | Medium | Add refresh rotation + blocklist for blocked users |
| Long JWT TTL (~10h) | Medium | Reduce to 15–60 min + refresh |
| CSRF disabled | Info | OK for Bearer-only APIs; never use cookie auth without CSRF |
| Category/ingredient write for any user | Medium | Restrict mutating verbs to ADMIN |
| Comment approve / ownership checks incomplete | Medium | Enforce author or ADMIN in service layer |
| XSS if API HTML rendered unsafely | Medium | Keep React text nodes; sanitize any future rich text |
| Dual token keys in sessionStorage | Low | Unify on Zustand-only or httpOnly cookies |
| Nested `.env` with DB password in backend repo | High | Rotate and gitignore; use secrets manager |
| Rate limiting only client-side on login | Medium | Add API rate limiting (Bucket4j / gateway) |

---

## Endpoint audit (high level)

| Area | Public | Auth | Admin | Notes |
|------|--------|------|-------|-------|
| Auth register/login | ✓ | | | Register no longer accepts role |
| Profile | | ✓ | | |
| Recipes CRUD | | ✓ | | Consider public GET for SEO |
| Uploads GET | ✓ | | | Ensure directory listing disabled |
| Admin users | | | ✓ | `hasAuthority("ADMIN")` |
| Actuator health | ✓ | | | Keep details authenticated |

---

## Frontend security practices

- Tokens in **sessionStorage** (not localStorage)
- Axios 401 → forced logout
- Zod validation on auth forms
- Client-side login attempt lockout (complementary only)
- `withCredentials: false`

## Password hashing

Backend uses **BCrypt** via `PasswordEncoder`. Mock server stores plaintext — **dev only**.
