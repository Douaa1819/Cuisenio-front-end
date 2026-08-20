# Roadmap & known limitations

## Known limitations

1. Recipe pages require authentication → weak organic SEO
2. No refresh-token / session revocation
3. Frontend mock API ahead of some Spring endpoints (reports, promotions)
4. Nested backend previously had deleted sources in working tree — restore before build
5. No Flyway migrations yet
6. Chatty landing/community components need extraction
7. Cypress e2e specs not present

## Future improvements (prioritized)

### P0 — Production readiness
- Public read APIs for approved recipes
- Flyway + `ddl-auto=validate`
- Refresh tokens + shorter access TTL
- API rate limiting
- Remove committed secrets; rotate keys

### P1 — Product differentiation
- AI recipe recommendations / substitutions
- Smart shopping list sync from meal planner
- Cooking progress / voice mode
- Collections & seasonal rails
- Nutrition analysis

### P2 — Scale & polish
- SSR or prerender for SEO
- Full i18n
- Observability (metrics, tracing)
- CDN for uploads
- Gamification / achievements

### P3 — Nice-to-have
- Social sharing cards as images
- Multi-tenant / teams for cooking schools
- Mobile native wrappers (Capacitor)

## Demo accounts reminder

Dev only — see README. Disable seeder in production.
