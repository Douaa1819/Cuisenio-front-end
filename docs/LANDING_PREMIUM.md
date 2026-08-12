# Landing Premium 2026 — setup

## Packages

Already required / installed for this landing:

```bash
npm install i18next react-i18next
# already in package.json: lucide-react, framer-motion
```

Optional (true WebGL scene). Network installs of `three` often fail — the landing ships a **lazy Framer Motion 3D tilt** hero instead, which keeps Lighthouse high without the Three.js weight:

```bash
npm install three @types/three @react-three/fiber @react-three/drei
```

## Structure

| Path | Role |
|------|------|
| `src/i18n/` | i18next init + FR / EN / AR / AR-MA dictionaries |
| `src/components/layout/ThemeAndLanguageBar.tsx` | Theme + 4-language switcher (RTL/LTR) |
| `src/components/home/HeroScene.tsx` | Lazy 3D tilt mock (no Three.js) |
| `src/components/home/LiveDemoWidget.tsx` | Scan + voice demo sans compte |
| `src/components/home/PricingTable.tsx` | Free vs PRO (RBAC demo) |
| `src/components/home/MarketingFooter.tsx` | Footer marketing |
| `src/pages/LandingPage.tsx` | Orchestrateur sections |

## Theme

- Default: light mint (`#F8FAFC` / `#059669`)
- Dark: slate glass (`#0F172A`)
- Persistence: `localStorage` key `cuisenio-theme`
- Fallback: `prefers-color-scheme` when nothing stored

## Locale

- Default: **English (`en`)**
- Key: `ui-locale`
- Also: `fr`, `ar`, `ar-MA` (Darija)
- RTL auto on `ar` and `ar-MA` via `document.documentElement.dir`
- Copy avoids em dashes and stays conversational for SEO + humans
