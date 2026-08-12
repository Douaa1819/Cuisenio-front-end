# Cuisenio

**Cuisenio** is a modern culinary platform for discovering, sharing, planning, and cooking recipes. Built as a full-stack portfolio SaaS: React + TypeScript frontend and Spring Boot + PostgreSQL backend.

> Brand spelling: **Cuisenio** (not Cuisinio).

---

## Why Cuisenio?

Cuisenio combines community recipes, meal planning, favorites, ratings, and an admin moderation console — with PWA installability, SEO foundations, and production-minded security.

---

## Quick start (frontend)

```bash
# 1. Install
npm install

# 2. Environment
cp .env.example .env
# VITE_API_URL=http://localhost:8080

# 3a. With real backend (see docs/INSTALLATION.md)
# 3b. Or mock API for frontend-only work:
node mock-server.cjs

# 4. Dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Demo accounts (development seeders only)

> Never show these credentials in the production UI. Documented here for local setup only.

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@cuisenio.com` | `Admin@2024!` |
| **Chef** | `fatima@cuisenio.com` | `Fatima@1234!` |

---

## Features

- Authentication (register, login, password reset, profile)
- Recipes (CRUD, search, images, difficulty, timing)
- Categories & ingredients
- Favorites (saved recipes)
- Ratings & comments
- Meal planner
- Admin dashboard (users, metrics)
- Light / dark theme + FR/EN i18n (partial)
- PWA install + offline shell caching
- Kitchen timer, shopping list, recently viewed recipes
- Personalized home (trending, for you, seasonal, continue cooking)
- Full-screen cooking mode with voice + achievements

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 19, TypeScript, Vite 6, Tailwind 4, Zustand, Axios, Framer Motion, Zod |
| Backend | Spring Boot 3.4, Java 17/21, Spring Security, JWT, JPA, PostgreSQL, MapStruct |
| Ops | Docker, Docker Compose, Actuator health |

---

## Project structure

```
Cuisenio-front-end/          # React SPA (this repo)
├── src/
│   ├── api/                 # HTTP clients & services
│   ├── components/          # UI, layout, recipe widgets
│   ├── pages/               # Route-level screens
│   ├── store/               # Zustand stores
│   ├── hooks/               # Data & UX hooks
│   └── types/               # Shared TypeScript types
├── public/                  # robots.txt, sitemap, PWA icons
├── docs/                    # Full documentation suite
├── mock-server.cjs          # Local mock API (port 8080)
└── Cuise-nio/               # Spring Boot backend (nested)
```

---

## Documentation index

| Document | Path |
|----------|------|
| Architecture | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Features | [docs/FEATURES.md](docs/FEATURES.md) |
| API | [docs/API.md](docs/API.md) |
| Auth flow | [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) |
| Database schema | [docs/DATABASE.md](docs/DATABASE.md) |
| Installation | [docs/INSTALLATION.md](docs/INSTALLATION.md) |
| Deployment | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| Environment variables | [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) |
| User guide | [docs/USER_GUIDE.md](docs/USER_GUIDE.md) |
| Admin guide | [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) |
| Security report | [docs/SECURITY.md](docs/SECURITY.md) |
| SEO report | [docs/SEO.md](docs/SEO.md) |
| Performance | [docs/PERFORMANCE.md](docs/PERFORMANCE.md) |
| Testing | [docs/TESTING.md](docs/TESTING.md) |
| UX report | [docs/UX.md](docs/UX.md) |
| Roadmap & improvements | [docs/ROADMAP.md](docs/ROADMAP.md) |
| Portfolio deliverable | [docs/DELIVERABLE.md](docs/DELIVERABLE.md) |

---

## Scripts

```bash
npm run dev          # Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
npm test             # Unit tests (Jest)
npm run test:e2e     # Cypress (when specs exist)
npm run mock         # Start mock API on :8080
```

---

## License

MIT — see portfolio use and personal projects.

## Author

Built by **Douaa1819** — [douaachemnane@gmail.com](mailto:douaachemnane@gmail.com)
