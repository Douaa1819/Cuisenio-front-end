# UX report

## Design identity

Cuisenio uses a **warm culinary coral** (`#E57373` / rose tokens), soft blush gradients, and Poppins — closer to a friendly food brand than generic purple SaaS.

## Improvements delivered

- Demo account shortcuts on login (faster recruiter demos)
- Kitchen timer + shopping list + recently viewed (differentiating cook workflow)
- PWA install prompt
- Page meta + JSON-LD for recipe richness
- Theme tokens aligned away from unused indigo/violet config
- Loading skeletons / empty states (existing + reinforced)

## Inspiration absorbed (not cloned)

| Platform | Takeaway applied carefully |
|----------|----------------------------|
| Tasty | Visual recipe focus, simple steps |
| Marmiton | Community trust signals (ratings/comments) |
| BBC Good Food | Clear timing + difficulty metadata |
| Food52 | Editorial breathing room / typography |
| Yummly | Personalization via saves + planner |

## Accessibility (WCAG-oriented)

| Criterion | Status |
|-----------|--------|
| Keyboard focus on controls | Mostly via Radix |
| Contrast on coral/white | Generally OK — verify badges |
| ARIA on icon-only buttons | Partial — expanded on timer/install |
| Skip link | Recommended next |
| Form errors linked to inputs | Login/register present |

## Remaining UX debt

- Landing page is long and mixed with marketing sections in first scroll — simplify hero budget
- Community page size (~very large file) hurts maintainability
- Incomplete i18n coverage
- Dark mode needs visual QA on every screen
