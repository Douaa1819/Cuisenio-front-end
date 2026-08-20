# Cuisenio

**Cuisenio** is a modern culinary platform for discovering, sharing, planning, and cooking recipes. Built as a full-stack portfolio SaaS: React + TypeScript frontend and Spring Boot + PostgreSQL backend.

> Brand spelling: **Cuisenio** (not Cuisinio).

---

## Why Cuisenio?

Cuisenio combines community recipes, meal planning, favorites, ratings, and an admin moderation console — with PWA installability, SEO foundations, and production-minded security.

---

## Quick start

```bash
# Frontend
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:8080
npm run dev            # http://localhost:5173

# Backend (from repo root, in another terminal)
cd backend
cp .env.example .env
./mvnw spring-boot:run   # http://localhost:8080
```

See [frontend/docs/INSTALLATION.md](frontend/docs/INSTALLATION.md) for PostgreSQL, Docker, and the mock API.

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
├── frontend/                # React SPA (Vite)
│   ├── src/                 # components, pages, api, store, hooks
│   ├── public/              # robots.txt, sitemap, PWA icons
│   ├── docs/                # Product documentation
│   ├── mock-server.cjs      # Local mock API (port 8080)
│   └── package.json
└── backend/                 # Spring Boot API
    ├── src/                 # controllers, services, entities, tests
    ├── pom.xml
    └── compose.yaml         # API + PostgreSQL
```

---

## Documentation index

| Document | Path |
|----------|------|
| Architecture | [frontend/docs/ARCHITECTURE.md](frontend/docs/ARCHITECTURE.md) |
| Features | [frontend/docs/FEATURES.md](frontend/docs/FEATURES.md) |
| API | [frontend/docs/API.md](frontend/docs/API.md) |
| Auth flow | [frontend/docs/AUTHENTICATION.md](frontend/docs/AUTHENTICATION.md) |
| Database schema | [frontend/docs/DATABASE.md](frontend/docs/DATABASE.md) |
| Installation | [frontend/docs/INSTALLATION.md](frontend/docs/INSTALLATION.md) |
| Deployment | [frontend/docs/DEPLOYMENT.md](frontend/docs/DEPLOYMENT.md) |
| Environment variables | [frontend/docs/ENVIRONMENT.md](frontend/docs/ENVIRONMENT.md) |
| User guide | [frontend/docs/USER_GUIDE.md](frontend/docs/USER_GUIDE.md) |
| Admin guide | [frontend/docs/ADMIN_GUIDE.md](frontend/docs/ADMIN_GUIDE.md) |
| Security report | [frontend/docs/SECURITY.md](frontend/docs/SECURITY.md) |
| SEO report | [frontend/docs/SEO.md](frontend/docs/SEO.md) |
| Performance | [frontend/docs/PERFORMANCE.md](frontend/docs/PERFORMANCE.md) |
| Testing | [frontend/docs/TESTING.md](frontend/docs/TESTING.md) |
| UX report | [frontend/docs/UX.md](frontend/docs/UX.md) |
| Roadmap & improvements | [frontend/docs/ROADMAP.md](frontend/docs/ROADMAP.md) |
| Portfolio deliverable | [frontend/docs/DELIVERABLE.md](frontend/docs/DELIVERABLE.md) |

---

## Scripts

From `frontend/`:

```bash
npm run dev          # Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
npm test             # Unit tests (Jest)
npm run test:e2e     # Cypress (when specs exist)
npm run mock         # Start mock API on :8080
```

From `backend/`:

```bash
./mvnw spring-boot:run
./mvnw test
docker compose up --build
```

---

## License

MIT — see portfolio use and personal projects.

## Author

Built by **Douaa1819** — [douaachemnane@gmail.com](mailto:douaachemnane@gmail.com)
