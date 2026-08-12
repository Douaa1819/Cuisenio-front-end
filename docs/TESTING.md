# Testing strategy

## Pyramid

```
        E2E (Cypress)     ← critical user journeys
     Integration / API    ← backend Testcontainers
  Unit (Jest + React TL)  ← components, stores, utils
```

## Frontend

```bash
npm test           # Jest
npm run test:e2e   # Cypress (add specs under cypress/e2e)
```

Current unit coverage focus:

- Auth store login/logout
- Shopping list / recently viewed stores
- Admin dashboard smoke (existing)

## Backend

Spring tests under `Cuise-nio/src/test` use JUnit 5 + Testcontainers (PostgreSQL).

```bash
cd Cuise-nio
./mvnw test
```

## Gaps / technical debt

- Cypress folder missing despite scripts
- Jest script historically absent — restored in `package.json`
- Frontend talks to endpoints not all present on Spring (mock parity drift)
- Prefer MSW for component tests instead of brittle mocks
