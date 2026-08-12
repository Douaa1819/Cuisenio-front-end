# SEO report

## Implemented

| Item | Status |
|------|--------|
| Meta title / description | `index.html` + `usePageMeta` hook |
| Open Graph / Twitter cards | Static + per-page via hook |
| Canonical URLs | Via `VITE_APP_URL` |
| robots.txt | `public/robots.txt` |
| sitemap.xml | `public/sitemap.xml` |
| Semantic landmarks | header/main/nav patterns |
| Recipe JSON-LD | Injected on recipe detail |
| Lazy images | Native `loading="lazy"` where applied |
| Friendly routes | `/recipe/:id` |

## Limitations (SPA)

Without SSR/prerender, crawlers that do not execute JS may only see the shell. Mitigations:

1. Prerender critical pages (vite-plugin-ssr / prerender-spa)
2. Or migrate recipe detail to SSR (Next/Remix) later
3. Keep sitemap pointing at public URLs once recipes are public

## Lighthouse SEO checklist

- [x] Document has title
- [x] Meta description
- [x] Crawlable links
- [ ] Recipes indexable without auth (currently behind login — **blocks organic SEO**)
- [x] robots.txt valid
- [ ] Structured data validated in Rich Results Test after deploy

## Priority recommendation

**Make approved recipe GET endpoints + detail pages publicly readable** while keeping create/comment/save authenticated. This single change unlocks organic recipe SEO.
