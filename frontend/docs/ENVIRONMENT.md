# Environment variables

## Frontend (`.env`)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | `http://localhost:8080` | API base URL, no trailing slash |
| `VITE_APP_URL` | No | `http://localhost:5173` | Canonical site URL for SEO meta |

Copy from `.env.example`. Never commit `.env`.

## Backend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | Yes (prod) | jdbc postgresql local | JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | Yes | postgres | DB user |
| `SPRING_DATASOURCE_PASSWORD` | Yes | — | DB password |
| `JWT_SECRET` | **Yes in prod** | weak default | HS256 signing key |
| `JWT_EXPIRATION` | No | 36000000 | ms (~10h) |
| `FILE_UPLOAD_DIR` | No | `./uploads` | Upload directory |
| `CORS_ALLOWED_ORIGINS` | Prod | localhost:5173 | Comma-separated origins |
| `CUISENIO_SEED_ENABLED` | Prod → false | true | Demo data seeder |
| `SPRING_JPA_DDL_AUTO` | Prod → validate | update | Schema strategy |
| `SERVER_PORT` | No | 8080 | HTTP port |

## Secrets policy

- Rotate JWT secret if leaked
- Demo passwords (`Admin@2024!`, etc.) are for **local/dev only**
- Prefer Docker secrets / cloud secret stores over `.env` files in production
