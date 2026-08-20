# Production Readiness Audit — July 2026

## Bugs fixed

| Bug | Root cause | Fix |
|-----|------------|-----|
| Home crash `Maximum update depth exceeded` / getSnapshot | `useAchievementsStore((s) => s.list())` allocated a **new array every render** | Select stable `unlocked` map; derive list with `useMemo` + `achievementsFromUnlocked` |
| Redirected to login after auth | Persist rehydration race: PrivateRoute saw `isAuthenticated=false` before hydrate | `hasHydrated` gate + boot loader on Private/Public routes |
| Session lost / 401 logout storms | Any 401 (incl. auth endpoints) forced `logout()` | Ignore 401 on login/register; logout only with active token |
| Blank home | Crash aborted render tree | Same achievements fix restores content |
| Demo credentials in production UI | Login form exposed emails/passwords | Removed demo account panel from Login |
| Confusing “User” role | Product needs Admin + Chef only | `normalizeRole()` maps legacy `USER` → `CHEF`; mock seed uses `CHEF` |

## Authentication & routing

- Roles: **ADMIN** | **CHEF** (`USER` accepted only as legacy alias)
- Post-login: Admin → `/dashboard`, Chef → `/chef`
- Hydration-safe guards
- Token kept in sync (`sessionStorage` + Zustand persist)

## Dashboard improvements

- **Admin**: sidebar SaaS shell (overview, users, chefs, recipes, approval queue, reports, analytics, settings), KPIs, charts, tables, confirm delete
- **Chef**: `/chef` workspace with recipe stats, pending/published, quick actions

## Remaining technical debt

- Backend Spring Boot Role enum still `USER` (normalized on client) — rename to `CHEF` in API when deploying real backend
- `community-page.tsx` still large / dual Nav patterns partially cleaned via AppShell
- Some admin moderation endpoints depend on mock feature parity
- Full “tags / ingredients / activity logs” admin modules sketched via nav — deepen with dedicated APIs
- Certificate / Maven SSL issues on this machine block local Spring Boot rebuild

## Future roadmap

1. Flyway + rename role `USER`→`CHEF` server-side
2. Public recipe SEO pages
3. Refresh tokens
4. Admin category/ingredient editors wired to CRUD
5. Audit log persistence

## Priority completed

1. ✔ Fix bugs (infinite loop)
2. ✔ Fix authentication (hydration)
3. ✔ Fix routing (chef/admin homes)
4. ✔ Fix dashboard (admin redesign + chef space)
5. ✔ UX (demo creds removed, clearer IA)
