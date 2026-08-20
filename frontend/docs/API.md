# API documentation

Base URL: `VITE_API_URL` (default `http://localhost:8080`)

Auth header: `Authorization: Bearer <jwt>`

---

## Auth — `/v1/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/v1/auth/register` | Public | Create USER account |
| POST | `/v1/auth/login` | Public | Returns JWT + user identity |

### Register body
```json
{
  "username": "Sara",
  "lastName": "Idrissi",
  "email": "sara@cuisenio.com",
  "password": "Sara@1234!"
}
```
> Role is **not** accepted — server always assigns `USER`.

### Login body
```json
{ "email": "ahmed@cuisenio.com", "password": "Ahmed@1234!" }
```

---

## Profile — `/v1/profile`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/profile` | Current user profile |
| PUT | `/v1/profile` | Update profile |
| PUT | `/v1/profile/password` | Change password |
| DELETE | `/v1/profile` | Delete account |

---

## Admin users — `/v1/admin/users` (ADMIN)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/admin/users` | List users |
| GET | `/v1/admin/users/count` | User count |
| PUT | `/v1/admin/users/{id}/block` | Block |
| PUT | `/v1/admin/users/{id}/unblock` | Unblock |
| DELETE | `/v1/admin/users/{id}` | Delete |

---

## Categories — `/v1/categories`

CRUD + `GET /count`

## Ingredients — `/v1/ingredients`

CRUD + `GET /count`

---

## Recipes — `/api/recipes`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/recipes` | List |
| GET | `/api/recipes/{id}` | Detail |
| GET | `/api/recipes/search` | Search |
| GET | `/api/recipes/my-recipes` | Current user's recipes |
| POST | `/api/recipes` | Create |
| PUT | `/api/recipes/{id}` | Update |
| DELETE | `/api/recipes/{id}` | Delete |
| POST | `/api/recipes/add-image/{recipeId}` | Multipart image |

### Saves
| Method | Path |
|--------|------|
| GET | `/api/recipes/saved` |
| POST | `/api/recipes/{id}/save` |
| DELETE | `/api/recipes/{id}/unsave` |
| GET | `/api/recipes/{id}/is-saved` |

### Comments — `/api/recipes/{recipeId}/comments`
POST, GET, PUT, DELETE, PATCH approve

### Ratings — `/api/recipes/{recipeId}/ratings`
POST, GET

---

## Meal plans — `/v1/meal-plans`

| Method | Path |
|--------|------|
| POST | `/v1/meal-plans/{recipeId}` |
| GET | `/v1/meal-plans` |
| PUT | `/v1/meal-plans/{id}` |
| DELETE | `/v1/meal-plans/{id}` |

---

## Errors

Spring `GlobalExceptionHandler` returns structured error payloads. Frontend `unified-client` normalizes envelopes and treats 401 as logout.
