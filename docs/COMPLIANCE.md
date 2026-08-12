# Conformité Cuisenio (RGPD · WCAG 2.2 AA · Sécurité · Newsletter)

## Livrables

### Backend newsletter
- `NewsletterSubscriber` (email unique, consent, `unsubscribeToken`, `active`)
- `POST /api/newsletter/subscribe` (public, `@Valid`, opt-in obligatoire, rate-limit IP)
- `GET /api/newsletter/unsubscribe?token=` (1 clic)
- Welcome email **loggé** (démo portfolio, pas de SMTP obligatoire)

### Frontend
- `NewsletterSection` (landing, i18n, `aria-live`, consent checkbox)
- `CookieBanner` (accept / refuse non-essentiel, `localStorage`)
- Pages `/privacy`, `/privacy-policy`, `/terms`, `/cookies`, `/newsletter/unsubscribe`
- Liens légaux dans le footer

### Sécurité
- Bean **BCrypt** (`BCryptPasswordEncoder(12)`) + `AuthenticationManager`
- Headers déjà en place dans `SecurityConfig` (CSP, XFO, XSS, HSTS, Referrer-Policy)
- DTOs auth / newsletter validés (`@Email`, `@NotBlank`, `@AssertTrue`)

---

## Récap accessibilité WCAG 2.2 AA

| Critère | Ajustement |
|---------|------------|
| Structure | Landing / légal : `header`, `main`, `nav`, `footer`, `section`, `article` |
| Focus | `:focus-visible` ring primary global (`index.css`) |
| Formulaires | Labels `htmlFor`, erreurs / succès `aria-live="polite"`, `aria-invalid` |
| Motion | `prefers-reduced-motion` CSS + hook `usePrefersReducedMotion` (Framer) |
| Contraste | Palette crème / sauge / anthracite (ratios texte > 4.5:1 sur fond clair) |
| Info non couleur seule | Icônes + texte sur états newsletter / cookies |
| Clavier | Bannière cookies & CTA focusables ; pas de piège de focus |
| Images | Icônes Lucide avec `aria-hidden` ; décoratifs sans texte parasite |
| SEO | `usePageMeta` (title, description, OG, canonical) sur pages légales & paiement |

---

## Test rapide newsletter

```bash
curl -X POST http://localhost:8080/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@cuisenio.test","consent":true}'
```

Désinscription : token loggé côté serveur →  
`GET /api/newsletter/unsubscribe?token=...` ou UI `/newsletter/unsubscribe?token=...`
