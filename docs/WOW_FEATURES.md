# Cuisenio — Features Wow (Import URL · Voice Cooking · Smart Planner · Premium RBAC)

## Architecture (packages)

```
Cuise-nio/src/main/java/com/youcode/cuisenio/
├── common/
│   ├── config/          SecurityConfig (@EnableMethodSecurity), HttpClientConfig (RestClient)
│   └── exception/       GlobalExceptionHandler → RFC 7807 ProblemDetail
└── features/
    ├── auth/
    │   ├── entity/      Role (USER|PREMIUM|ADMIN), SubscriptionTier (FREE|PRO), User
    │   └── controller/  SubscriptionController  POST /v1/subscription/upgrade-premium
    ├── recipe/
    │   ├── dto/importdto/
    │   ├── service/impl/RecipeImportServiceImpl  (Jsoup + JSON-LD + RestClient)
    │   └── controller/  RecipeImportController   POST /v1/recipes/import/preview  [@PreAuthorize PREMIUM]
    └── mealplan/
        ├── dto/request|response/  SmartPlan*, ShoppingList*
        ├── service/impl/SmartMealPlannerServiceImpl  (JPA filter + merge quantités)
        └── controller/  SmartMealPlannerController   /v1/meal-plans/smart/**

src/
├── components/
│   ├── recipe/RecipeUrlImport.tsx
│   ├── premium/PremiumUpgradeModal.tsx
│   └── kitchen/CookingMode.tsx          (SpeechRecognition + Synthesis)
├── api/
│   ├── recipe-import.service.ts
│   ├── subscription.service.ts
│   ├── smart-meal-planner.service.ts
│   └── client.ts                        (403 → auth:forbidden)
└── types/auth.types.ts                  (PREMIUM + isPremiumUser)
```

## Principes

| Couche | Règle |
|--------|--------|
| Controller | DTOs only + `@Valid` |
| Service | Business logic, jamais d'entité exposée |
| Security | Authorities sans préfixe `ROLE_` → `hasAuthority('PREMIUM')` |
| Errors | `ProblemDetail` unifié (`code`, `message`, `path`, `timestamp`) |
| Premium | Fictif — `POST /v1/subscription/upgrade-premium` régénère le JWT |

## Démarrage local

### 1. Backend

```bash
cd Cuise-nio
# PostgreSQL up (compose.yaml) + JWT_SECRET
./mvnw spring-boot:run
```

Vérifier: `GET http://localhost:8080/actuator/health`

### 2. Frontend

```bash
cd ..
npm install
npm run dev          # http://localhost:5173
# optionnel mock si DB down:
npm run mock         # http://localhost:8080
```

> Le mock Node ne couvre pas encore `/v1/recipes/import` ni `/v1/meal-plans/smart` — utilisez le vrai Spring Boot pour ces demos.

### 3. Scénario Premium (entretien)

1. Register / Login (rôle `USER` / surface Chef).
2. Aller sur **Créer une recette** → **Importer par lien** → 403 ou modal Premium.
3. Cliquer **Activer Premium (fictif)** → nouveau JWT `PREMIUM` + badge PRO.
4. Relancer l'import avec une URL schema.org Recipe (ex. site cuisine avec JSON-LD).
5. Appeler `POST /v1/meal-plans/smart/generate` (body ci-dessous) ou brancher le bouton UI planner.

```json
{
  "startDate": "2026-07-27",
  "mealCount": 7,
  "maxPrepMinutes": 60,
  "budgetLevel": 2
}
```

### 4. Mode cuisine vocal

1. Ouvrir une fiche recette → Mode cuisine.
2. Activer le micro (Chrome recommandé, HTTPS ou localhost).
3. Dire: « étape suivante », « précédente », « répète », « lance le minuteur 5 minutes ».

## Endpoints ajoutés

| Method | Path | Auth |
|--------|------|------|
| POST | `/v1/subscription/upgrade-premium` | authenticated |
| POST | `/v1/recipes/import/preview` | PREMIUM \| ADMIN |
| POST | `/v1/meal-plans/smart/generate` | PREMIUM \| ADMIN |
| POST | `/v1/meal-plans/smart/shopping-list` | authenticated |

## Points à mentionner en entretien

1. **RBAC réel** : `@EnableMethodSecurity` + `@PreAuthorize` + filtre HTTP — pas seulement du masquage UI.
2. **DTO / Records Java 17** : zéro fuite d'entité JPA.
3. **RFC 7807** : erreurs homogènes pour le SPA (modal upgrade sur `upgradeHint`).
4. **Scraper défensif** : timeout RestClient, blocage localhost, JSON-LD prioritaire, fallback HTML.
5. **Shopping list merge** : clé `name|unit`, somme des quantités, rayons (Légumes / Frais / Épicerie).
