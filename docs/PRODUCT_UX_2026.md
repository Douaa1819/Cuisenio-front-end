# Product & UX Evolution Report — Cuisenio 2026

## Mission summary

Transform Cuisenio from a catalogue-style community page into a **personalized cooking OS**: less scrolling dead-ends, clearer hierarchy, mobile-first navigation, and cook-first interactions.

---

## 1. UX audit (key findings → fixes)

| Problem | Why it hurts | Impact | Solution shipped |
|---------|--------------|--------|------------------|
| `/home` was a dense community feed | Users landing after login see noise, not “what should I cook?” | Drop-off, weak delight | New **personalized Home** with rails |
| Primary CTA buried | No one-tap “cook now” | Recipes aren’t completed | **Mode cuisine** fullscreen CTA |
| Mobile nav via hamburger only | Thumb-unfriendly, extra taps | High mobile friction | **Bottom navigation** (5 destinations) |
| Search requires filters dialog | Too many clicks | Abandoned searches | **Instant search + chips** on Home |
| Weak empty / continue states | No momentum across sessions | Low retention | Continue cooking banner + recently viewed |
| Missing cooking feedback | Completing a recipe felt empty | Low emotional reward | Streaks + achievements toasts |
| Accessibility gaps | Skip link, reduced motion absent | a11y score risk | Skip link, focus rings, `prefers-reduced-motion` |
| Inconsistent chrome | Some pages Nav-only | Confusing IA | **AppShell** (Nav + BottomNav + toasts) |

---

## 2. Product / flow improvements

### Discover
Home → rails or instant search → recipe detail (1–2 taps).

### Cook
Recipe → **Mode cuisine** → checklist + steps + timer + voice → complete → streak/achievement.

### Save / shop
Ingredients → shopping list (existing) remains in header; completions feed achievements.

### Auth
Unchanged security model; demo accounts still help recruiters.

### Meal plan / Admin
Routes preserved; bottom nav surfaces planner for members.

---

## 3. New features (problem-backed)

| Feature | User problem | Notes |
|---------|--------------|-------|
| Personalized Home | “I don’t know what to cook” | For you, trending, quick, seasonal, chefs |
| Continue cooking | Interrupted sessions | Persisted in `cooking.store` |
| Cooking mode + voice | Phone on the counter | Fullscreen, progress, SpeechSynthesis FR |
| Ingredient substitutions | Missing pantry items | Heuristic dictionary |
| Nutrition & cost estimates | Planning / curiosity | Explicitly “indicatif” |
| Native share / copy link | Sharing recipes | Web Share API + clipboard |
| Instant search suggestions | Faster find | Client-side over loaded recipes |
| Achievements & streak | Habit loop | Local persist, no spammy gamification UI |
| Bottom nav | Mobile IA | Accueil / Explorer / Créer / Plans / Profil |

---

## 4. Intentionally not built (yet)

Removed from scope to protect simplicity:

- Real AI LLM generator (needs API keys + cost control)
- Ingredient camera scanner
- Social follow graph (needs backend)
- Comment reply trees at scale
- Calorie DB accuracy claims
- Drag-and-drop meal planner rewrite

These appear on the roadmap when they have reliable data.

---

## 5. Accessibility

- Skip-to-content link
- Bottom nav labels + `aria-label`
- Combobox search semantics
- Focus-visible styles
- Reduced motion media query
- Larger touch targets (`min-h-11`) in cooking mode / bottom nav

**Estimated WCAG trajectory:** solid AA foundation on new surfaces; legacy community page still needs contrast + heading pass.

---

## 6. Mobile usability

- Bottom nav first-class
- Horizontal recipe rails with snap
- Fullscreen cook mode for countertop use
- PWA install prompt retained

---

## 7. Performance impact

- Home loads recipes once then derives rails client-side (OK for demo scale)
- Lazy routes unchanged
- Cooking mode is code-split with recipe detail via shared imports

Watch: large `community-page.tsx` still heavy — progressive extraction recommended.

---

## 8. SEO impact

- Authenticated home remains private (expected)
- Recipe JSON-LD + meta hooks still apply on detail
- Discover/home content not crawled without public recipe GET (known limitation)

---

## 9. Technical complexity

| Area | Complexity |
|------|------------|
| Home rails + ranking | Medium |
| Cooking mode | Medium |
| Achievements / streak | Low |
| Substitutions / nutrition heuristics | Low |
| Full social graph | High (deferred) |

---

## 10. Future roadmap

1. Public recipe pages for SEO
2. Server-side recommendations
3. Planner ↔ shopping list sync
4. Follow chefs + public profiles
5. Optional LLM generator behind feature flag
6. Extract community page into modular components

---

## Recruiter talking points

- Product thinking: every feature maps to a job-to-be-done
- Cook-first UX (spotify-like “continue”, duolingo-like streak without clutter)
- Mobile shell + a11y basics
- Client intelligence without fake “AI” hallucination claims
