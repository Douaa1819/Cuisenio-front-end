# Performance report

## Frontend

| Technique | Status |
|-----------|--------|
| Route-level code splitting (`React.lazy`) | ✓ |
| Tailwind JIT / Vite tree-shaking | ✓ |
| PWA precache of shell | ✓ |
| Image lazy loading | Partial |
| Bundle analysis | Recommended (`rollup-plugin-visualizer`) |
| Virtualization for long lists | Not yet |

## Backend

| Technique | Status |
|-----------|--------|
| HikariCP pool | ✓ |
| JPA fetch tuning | Needs review (N+1 risk on recipe detail) |
| DB indexes | Documented, not migrated yet |
| Pagination | Pageable on some endpoints |

## Core Web Vitals tips

1. Compress recipe images (WebP, ≤200KB hero)
2. Preconnect API + font hosts
3. Avoid huge landing page JS — continue lazy sections
4. Prefer `content-visibility` for below-fold community grids
5. Cache API GETs with short TTL (HTTP Cache-Control / CDN)

## Lighthouse performance suggestions

- Serve modern image formats
- Reduce unused JS (drop unused `@reduxjs/toolkit` if unused)
- Remove duplicate clients/files
- Enable Brotli on CDN
- Keep LCP image discoverable in first viewport (landing hero)
