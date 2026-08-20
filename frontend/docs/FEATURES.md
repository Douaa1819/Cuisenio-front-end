# Features catalog

For each feature: purpose, business logic, user flow, implementation, improvements.

---

## Authentication

| | |
|--|--|
| **Purpose** | Secure access to community, planner, profile, admin |
| **Logic** | Register → USER only; login → JWT; blocked users rejected |
| **Flow** | Landing → Login/Register → `/home` or `/dashboard` |
| **Impl** | `auth.service.ts`, `auth.store.ts`, Spring `AuthServiceImpl`, `JwtUtil` |
| **Improve** | Refresh tokens, email verification, OAuth (Google) |

---

## Recipes

| | |
|--|--|
| **Purpose** | Core content unit — create, browse, detail |
| **Logic** | Recipes linked to author + category; optional approval flag |
| **Flow** | Community grid → detail → cook / save / comment |
| **Impl** | `recipe.service.ts`, `RecipeController`, entities `Recipe`, `RecipeStep`, `RecipeIngredient` |
| **Improve** | Public recipe URLs (SEO), draft autosave, versioning |

---

## Categories & ingredients

| | |
|--|--|
| **Purpose** | Taxonomy for filtering and recipe composition |
| **Logic** | Categories named (meal types, cuisines); ingredients reusable |
| **Flow** | Select while creating recipe; filter on community |
| **Impl** | `category.service.ts`, `ingredient.service.ts` |
| **Improve** | Tag graph, nutritional metadata, alias normalization |

---

## Favorites (saved recipes)

| | |
|--|--|
| **Purpose** | Personal cookbook |
| **Logic** | Unique `(user_id, recipe_id)` |
| **Flow** | Heart/bookmark on detail → list on profile/community |
| **Impl** | `SavedRecipe` + `/api/recipes/{id}/save` |
| **Improve** | Collections / folders |

---

## Search

| | |
|--|--|
| **Purpose** | Find recipes by title/keywords |
| **Logic** | Backend `GET /api/recipes/search` |
| **Flow** | Search bar on community page |
| **Impl** | `recipe.service.ts` search method |
| **Improve** | Full-text search, filters (time, difficulty, cuisine), Faceted search |

---

## Ratings & comments

| | |
|--|--|
| **Purpose** | Social proof and community feedback |
| **Logic** | Score + text comments per user/recipe |
| **Flow** | Detail page → rate / comment |
| **Impl** | Rating & Comment controllers + dialogs |
| **Improve** | Moderation queue ownership checks, edit history |

---

## Meal planner

| | |
|--|--|
| **Purpose** | Weekly meal organization |
| **Logic** | Plan entries: date, day, meal type, recipe, servings |
| **Flow** | `/meal-planner` → pick recipe → slot |
| **Impl** | `meal-planner.service.ts`, `MealPlanner` entity |
| **Improve** | Drag-and-drop week view, grocery export sync |

---

## User profile

| | |
|--|--|
| **Purpose** | Identity and account settings |
| **Logic** | Update profile fields; password change with current password |
| **Flow** | `/profile` tabs: overview, preferences, security |
| **Impl** | `ProfilePage.tsx`, `/v1/profile` |
| **Improve** | Avatar upload, public chef profiles |

---

## Admin dashboard

| | |
|--|--|
| **Purpose** | Platform governance |
| **Logic** | `ADMIN` authority required |
| **Flow** | Login as admin → `/dashboard` |
| **Impl** | `AdminDashboard.tsx`, `AdminUserController` |
| **Improve** | Audit log, recipe moderation queue UI alignment with API |

---

## Theme & i18n

| | |
|--|--|
| **Purpose** | Accessibility and localization |
| **Logic** | Light/dark/system; fr/en dictionary |
| **Flow** | Profile preferences |
| **Impl** | `use-theme.tsx`, `I18nContext` |
| **Improve** | Full string coverage, RTL, locale-aware dates |

---

## PWA / offline

| | |
|--|--|
| **Purpose** | App-like install, offline resilience |
| **Logic** | Manifest + Workbox caching of shell + recently viewed |
| **Flow** | Install prompt → home screen icon |
| **Impl** | `vite-plugin-pwa`, `InstallPrompt` |
| **Improve** | Background sync for offline comments, recipe full offline pack |

---

## Kitchen timer

| | |
|--|--|
| **Purpose** | Hands-free cooking aid |
| **Logic** | Client-side countdown with notification |
| **Flow** | Recipe detail → start timer |
| **Impl** | `KitchenTimer.tsx` |
| **Improve** | Multi-timer, voice cues |

---

## Shopping list

| | |
|--|--|
| **Purpose** | Aggregate ingredients from recipes / planner |
| **Logic** | Local Zustand list, toggle checked items |
| **Flow** | Add from recipe → open list in nav |
| **Impl** | `shopping-list.store.ts` |
| **Improve** | Server sync, store aisle grouping |

---

## Recently viewed

| | |
|--|--|
| **Purpose** | Continue cooking / quick return |
| **Logic** | Persist last N recipes in localStorage |
| **Flow** | Auto on detail visit → show on home |
| **Impl** | `recently-viewed.store.ts` |
| **Improve** | Cross-device sync when logged in |
