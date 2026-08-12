# Database schema

PostgreSQL via Spring Data JPA.

```
users ─┬─< recipes >─┬─ categories
       ├─< comments  │
       ├─< ratings   ├─< recipeIngredients >─ ingredients
       ├─< saved_recipes
       └─< meal_plans
                 recipes >─ recipe_steps
```

## Tables

### users
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| username, last_name | VARCHAR | |
| email | VARCHAR | UNIQUE |
| password | VARCHAR | BCrypt hash |
| role | ENUM | USER \| ADMIN |
| blocked | BOOLEAN | |
| registration_date | TIMESTAMP | |

### categories
id, name

### ingredients
id, name

### recipes
id, title, description (TEXT), difficulty_level, preparation_time, cooking_time, servings, image_url, creation_date, is_approved, user_id, categorie_id

### recipe_ingredients
id, quantity, unit, recipe_id, ingredient_id

### recipe_steps
id, step_number, description, recipe_id

### comments
id, content, created_at, recipe_id, user_id

### recipe_rating
id, score, created_at, recipe_id, user_id

### saved_recipes
id, user_id, recipe_id, saved_at — UNIQUE(user_id, recipe_id)

### meal_plans
id, user_id, recipe_id, planning_date, day_of_week, meal_type, servings, notes

## Indexes recommended for production

```sql
CREATE INDEX idx_recipes_title ON recipes (title);
CREATE INDEX idx_recipes_user ON recipes (user_id);
CREATE INDEX idx_recipes_category ON recipes (categorie_id);
CREATE INDEX idx_comments_recipe ON comments (recipe_id);
CREATE INDEX idx_ratings_recipe ON recipe_rating (recipe_id);
```

## Schema management

- Dev: `ddl-auto=update` + `DataSeeder`
- Prod: Flyway/Liquibase + `ddl-auto=validate` (recommended next step)
