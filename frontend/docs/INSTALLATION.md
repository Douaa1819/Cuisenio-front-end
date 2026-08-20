# Installation guide

## Prerequisites

- Node.js 20+
- npm 10+
- JDK 17+ (backend)
- Maven 3.9+ (or use `./mvnw`)
- PostgreSQL 13+
- Optional: Docker Desktop

---

## Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

### Option A — Mock API (no Java/Postgres)

```bash
cd frontend
npm run mock   # or: node mock-server.cjs
npm run dev
```

### Option B — Real Spring Boot API

1. Start PostgreSQL and create DB `cuisenio`.
2. Configure backend env (see [ENVIRONMENT.md](./ENVIRONMENT.md)).
3. From `backend/`:

```bash
cd backend
./mvnw spring-boot:run
```

4. Frontend:

```bash
cd frontend
npm run dev
```

Seeded demo accounts appear automatically when `CUISENIO_SEED_ENABLED=true`.

---

## Backend Docker Compose

```bash
cd backend
docker compose up --build
```

---

## Verify

| Check | URL |
|-------|-----|
| SPA | http://localhost:5173 |
| API health | http://localhost:8080/actuator/health |
| Login admin | `admin@cuisenio.com` / `Admin@2024!` |
