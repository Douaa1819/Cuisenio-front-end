# Deployment guide

## Frontend (static SPA)

```bash
npm run build
# dist/ → Nginx, Netlify, Vercel, S3+CloudFront
```

### Nginx essentials

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  add_header X-Content-Type-Options nosniff;
  add_header X-Frame-Options DENY;
  add_header Referrer-Policy strict-origin-when-cross-origin;
}
```

### Docker (frontend)

```bash
docker build -t cuisenio-web .
docker run -p 80:80 -e VITE_API_URL=https://api.example.com cuisenio-web
```

> Note: Vite embeds `VITE_*` at **build** time. Pass build args, not only runtime env.

## Backend

```bash
cd Cuise-nio
docker compose up -d --build
```

Production checklist:

1. Set strong `JWT_SECRET` (≥32 bytes random)
2. Set DB credentials via secrets manager
3. `SPRING_JPA_DDL_AUTO=validate` + migrations
4. `CUISENIO_SEED_ENABLED=false`
5. Restrict `CORS_ALLOWED_ORIGINS` to your domain
6. TLS termination (reverse proxy)
7. Persistent volume for `uploads/`

## CI/CD recommendations

| Stage | Action |
|-------|--------|
| PR | lint, unit tests, `tsc -b` |
| Main | build images, push registry |
| Deploy | blue/green or rolling; smoke `/actuator/health` |

## Monitoring

- Actuator health/info
- Centralized logs (JSON) — never log password hashes
- Uptime checks on SPA + API
- Error tracking (Sentry) on frontend
