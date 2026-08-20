const http = require("http")
const url = require("url")

// ── Fake data ──────────────────────────────────────────────────────────────────

const FAKE_TOKEN_PREFIX = "mock-token"

// ── Admin credentials (unique — only this account has ADMIN role) ──────────────
const ADMIN_EMAIL    = "admin@cuisenio.com"
const ADMIN_PASSWORD = "Admin@2024!"

// fakeUsers stores passwords for the mock only.
// A real backend would hash them with bcrypt — NEVER store plaintext in production.
const fakeUsers = [
  { id: 1, username: "Admin", lastName: "Cuisenio", email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: "ADMIN", registrationDate: "2024-01-15T10:00:00", status: "active", isShadowBanned: false, subscriptionTier: "PRO" },
  { id: 2, username: "Ahmed", lastName: "Karim", email: "ahmed@cuisenio.com", password: "Ahmed@1234!", role: "CHEF", registrationDate: "2024-02-20T14:30:00", status: "active", isShadowBanned: false, subscriptionTier: "FREE" },
  { id: 3, username: "Fatima", lastName: "Zahra", email: "fatima@cuisenio.com", password: "Fatima@1234!", role: "PREMIUM", registrationDate: "2024-03-05T09:15:00", status: "active", isShadowBanned: false, subscriptionTier: "PRO" },
  { id: 4, username: "Youssef", lastName: "El Amrani", email: "youssef@cuisenio.com", password: "Youssef@1234!", role: "CHEF", registrationDate: "2024-03-10T16:45:00", status: "suspended", isShadowBanned: true, subscriptionTier: "FREE" },
  { id: 5, username: "Sara", lastName: "Idrissi", email: "sara@cuisenio.com", password: "Sara@1234!", role: "CHEF", registrationDate: "2024-04-01T11:00:00", status: "active", isShadowBanned: false, subscriptionTier: "FREE" },
  { id: 6, username: "Omar", lastName: "Benjelloun", email: "omar@cuisenio.com", password: "Omar@1234!", role: "CHEF", registrationDate: "2024-05-12T08:30:00", status: "active", isShadowBanned: false, subscriptionTier: "FREE" },
]

let fakeNewsletterSubscribers = [
  { id: 1, email: "lea.martin@example.com", subscribedAt: "2025-11-02T09:12:00.000Z", active: true, consentGiven: true, origin: "Home Page" },
  { id: 2, email: "karim.bennani@example.com", subscribedAt: "2025-12-18T14:40:00.000Z", active: true, consentGiven: true, origin: "Home Page" },
  { id: 3, email: "sofia.chen@example.com", subscribedAt: "2026-01-09T08:05:00.000Z", active: false, consentGiven: true, origin: "Home Page" },
  { id: 4, email: "noura.elidrissi@example.com", subscribedAt: "2026-03-22T16:20:00.000Z", active: true, consentGiven: true, origin: "Home Page" },
  { id: 5, email: "demo@cuisenio.com", subscribedAt: "2026-06-01T11:00:00.000Z", active: true, consentGiven: true, origin: "Home Page" },
]

/** In-app inbox notifications (soft realtime via poll) */
let fakeNotifications = [
  {
    id: 1,
    recipientId: 2,
    type: "LIKE",
    message: "Fatima a aimé votre recette « Tajine de poulet »",
    targetUrl: "/recipe/1",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    actor: { id: 3, username: "Fatima", lastName: "Zahra" },
  },
  {
    id: 2,
    recipientId: 2,
    type: "COMMENT",
    message: "Omar a laissé un commentaire sur votre recette « Tajine de poulet »",
    targetUrl: "/recipe/1",
    read: false,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    actor: { id: 6, username: "Omar", lastName: "Benjelloun" },
  },
  {
    id: 3,
    recipientId: 2,
    type: "RECIPE_APPROVED",
    message: "Votre recette « Harira Marocaine » a été validée et est maintenant visible.",
    targetUrl: "/recipe/2",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    actor: { id: 1, username: "Admin", lastName: "Cuisenio" },
  },
]

function pushNotification({ recipientId, type, message, targetUrl, actor }) {
  if (!recipientId || (actor && actor.id === recipientId)) return
  fakeNotifications.unshift({
    id: fakeNotifications.reduce((max, n) => Math.max(max, n.id), 0) + 1,
    recipientId,
    type,
    message,
    targetUrl: targetUrl || null,
    read: false,
    createdAt: new Date().toISOString(),
    actor: actor
      ? { id: actor.id, username: actor.username, lastName: actor.lastName }
      : null,
  })
}

let fakeCategories = [
  { id: 1, name: "Desserts" },
  { id: 2, name: "Plats principaux" },
  { id: 3, name: "Entrées" },
  { id: 4, name: "Soupes" },
  { id: 5, name: "Salades" },
  { id: 6, name: "Boissons" },
  { id: 7, name: "Apéritifs" },
  { id: 8, name: "Sauces et condiments" },
]

let fakeIngredients = [
  { id: 1, name: "Farine", masterIngredientId: 1 },
  { id: 2, name: "Sucre", masterIngredientId: 2 },
  { id: 3, name: "Beurre", masterIngredientId: 3 },
  { id: 4, name: "Oeufs", masterIngredientId: 4 },
  { id: 5, name: "Lait", masterIngredientId: 5 },
  { id: 6, name: "Sel", masterIngredientId: 6 },
  { id: 7, name: "Poivre", masterIngredientId: 7 },
  { id: 8, name: "Huile d'olive", masterIngredientId: 8 },
  { id: 9, name: "Ail", masterIngredientId: 9 },
  { id: 10, name: "Oignon", masterIngredientId: 10 },
  { id: 11, name: "Tomate", masterIngredientId: 11 },
  { id: 12, name: "Poulet", masterIngredientId: 12 },
  { id: 13, name: "Citron", masterIngredientId: 13 },
  { id: 14, name: "Persil", masterIngredientId: 14 },
  { id: 15, name: "Cumin", masterIngredientId: 15 },
]

let masterIngredients = fakeIngredients.map((ingredient) => ({
  id: ingredient.masterIngredientId,
  canonicalName: ingredient.name,
}))

const fakeRecipes = [
  {
    id: 1,
    title: "Tajine de Poulet aux Citrons Confits",
    description: "Un tajine savoureux aux arômes d'épices marocaines, avec du poulet tendre et des citrons confits. Un plat traditionnel qui régalera toute la famille.",
    difficultyLevel: "EASY",
    preparationTime: 30,
    cookingTime: 60,
    servings: 4,
    imageUrl: null,
    creationDate: "2024-03-01T10:00:00",
    updateDate: "2024-03-01T10:00:00",
    isApproved: true,
    averageRating: 4.8,
    totalRatings: 52,
    totalComments: 14,
    user: { id: 2, username: "Ahmed", lastName: "Karim", email: "ahmed@cuisenio.com", profilePicture: null },
    categories: [{ id: 2, name: "Plats principaux", type: "MAIN" }],
    recipeIngredients: [
      { id: 1, quantity: "1", unit: "kg", ingredient: { id: 12, name: "Poulet" } },
      { id: 2, quantity: "2", unit: "pièces", ingredient: { id: 13, name: "Citron" } },
      { id: 3, quantity: "1", unit: "tête", ingredient: { id: 9, name: "Ail" } },
    ],
    steps: [
      { id: 1, stepNumber: 1, description: "Faire mariner le poulet avec les épices pendant 2h." },
      { id: 2, stepNumber: 2, description: "Dans un tajine, faire revenir les oignons dans l'huile d'olive." },
      { id: 3, stepNumber: 3, description: "Ajouter le poulet et faire dorer de tous côtés." },
      { id: 4, stepNumber: 4, description: "Ajouter les citrons confits et les olives, puis laisser mijoter 45 min." },
    ],
  },
  {
    id: 2,
    title: "Harira Marocaine",
    description: "La soupe traditionnelle marocaine, riche en légumineuses et épices. Parfaite pour le ramadan ou les soirées fraîches.",
    difficultyLevel: "EASY",
    preparationTime: 20,
    cookingTime: 45,
    servings: 6,
    imageUrl: null,
    creationDate: "2024-03-05T14:00:00",
    updateDate: "2024-03-05T14:00:00",
    isApproved: true,
    averageRating: 4.9,
    totalRatings: 87,
    totalComments: 23,
    user: { id: 3, username: "Fatima", lastName: "Zahra", email: "fatima@cuisenio.com", profilePicture: null },
    categories: [{ id: 4, name: "Soupes", type: "SOUP" }],
    recipeIngredients: [
      { id: 4, quantity: "200", unit: "g", ingredient: { id: 1, name: "Farine" } },
      { id: 5, quantity: "2", unit: "pièces", ingredient: { id: 11, name: "Tomate" } },
    ],
    steps: [
      { id: 5, stepNumber: 1, description: "Faire revenir les oignons et l'ail dans l'huile." },
      { id: 6, stepNumber: 2, description: "Ajouter les tomates et laisser cuire 10 min." },
      { id: 7, stepNumber: 3, description: "Ajouter les légumineuses et le bouillon." },
      { id: 8, stepNumber: 4, description: "Épaissir avec la farine délayée." },
    ],
  },
  {
    id: 3,
    title: "Pastilla au Poulet",
    description: "La pastilla, ce feuilleté sucrée-salée emblématique de la cuisine marocaine, avec son alliance de saveurs unique.",
    difficultyLevel: "INTERMEDIATE",
    preparationTime: 60,
    cookingTime: 40,
    servings: 8,
    imageUrl: null,
    creationDate: "2024-03-10T09:00:00",
    updateDate: "2024-03-10T09:00:00",
    isApproved: true,
    averageRating: 4.7,
    totalRatings: 34,
    totalComments: 9,
    user: { id: 5, username: "Sara", lastName: "Idrissi", email: "sara@cuisenio.com", profilePicture: null },
    categories: [{ id: 7, name: "Apéritifs", type: "STARTER" }],
    recipeIngredients: [],
    steps: [],
  },
  {
    id: 4,
    title: "Couscous Royal",
    description: "Le couscous, plat national du Maghreb, préparé avec des légumes variés et de la viande d'agneau tender.",
    difficultyLevel: "INTERMEDIATE",
    preparationTime: 45,
    cookingTime: 90,
    servings: 6,
    imageUrl: null,
    creationDate: "2024-03-12T11:00:00",
    updateDate: "2024-03-12T11:00:00",
    isApproved: true,
    averageRating: 4.6,
    totalRatings: 41,
    totalComments: 11,
    user: { id: 6, username: "Omar", lastName: "Benjelloun", email: "omar@cuisenio.com", profilePicture: null },
    categories: [{ id: 2, name: "Plats principaux", type: "MAIN" }],
    recipeIngredients: [],
    steps: [],
  },
  {
    id: 5,
    title: "Salade Marocaine",
    description: "Une salade fraîche et colorée avec des tomates, concombres et herbes fraîches, assaisonnée à l'huile d'olive.",
    difficultyLevel: "EASY",
    preparationTime: 15,
    cookingTime: 0,
    servings: 4,
    imageUrl: null,
    creationDate: "2024-03-15T08:00:00",
    updateDate: "2024-03-15T08:00:00",
    isApproved: true,
    averageRating: 4.3,
    totalRatings: 28,
    totalComments: 5,
    user: { id: 3, username: "Fatima", lastName: "Zahra", email: "fatima@cuisenio.com", profilePicture: null },
    categories: [{ id: 5, name: "Salades", type: "SALAD" }],
    recipeIngredients: [],
    steps: [],
  },
  {
    id: 6,
    title: "Msemen (Crêpes Marocaines)",
    description: "Le msemen, cette crêpe feuilletée marocaine dorée et croustillante, parfaite pour le petit déjeuner.",
    difficultyLevel: "INTERMEDIATE",
    preparationTime: 30,
    cookingTime: 20,
    servings: 8,
    imageUrl: null,
    creationDate: "2024-03-17T07:30:00",
    updateDate: "2024-03-17T07:30:00",
    isApproved: true,
    averageRating: 4.5,
    totalRatings: 63,
    totalComments: 18,
    user: { id: 2, username: "Ahmed", lastName: "Karim", email: "ahmed@cuisenio.com", profilePicture: null },
    categories: [{ id: 3, name: "Entrées", type: "STARTER" }],
    recipeIngredients: [],
    steps: [],
  },
  {
    id: 7,
    title: "Thé à la Menthe",
    description: "Le célèbre thé à la menthe marocain, servi avec art, symbole d'hospitalité.",
    difficultyLevel: "EASY",
    preparationTime: 10,
    cookingTime: 5,
    servings: 4,
    imageUrl: null,
    creationDate: "2024-03-18T15:00:00",
    updateDate: "2024-03-18T15:00:00",
    isApproved: true,
    averageRating: 4.9,
    totalRatings: 120,
    totalComments: 30,
    user: { id: 1, username: "Douae", lastName: "Benali", email: "douae@cuisenio.com", profilePicture: null },
    categories: [{ id: 6, name: "Boissons", type: "DRINK" }],
    recipeIngredients: [],
    steps: [],
  },
  {
    id: 8,
    title: "Briouats aux Amandes",
    description: "Ces petits feuilletés croustillants farcis d'amandes parfumées à la fleur d'oranger sont irrésistibles.",
    difficultyLevel: "ADVANCED",
    preparationTime: 60,
    cookingTime: 25,
    servings: 20,
    imageUrl: null,
    creationDate: "2024-03-19T10:00:00",
    updateDate: "2024-03-19T10:00:00",
    isApproved: true,
    averageRating: 4.8,
    totalRatings: 45,
    totalComments: 12,
    user: { id: 5, username: "Sara", lastName: "Idrissi", email: "sara@cuisenio.com", profilePicture: null },
    categories: [{ id: 1, name: "Desserts", type: "DESSERT" }],
    recipeIngredients: [],
    steps: [],
  },
  {
    id: 9,
    title: "Chefchouka",
    description: "Des oeufs pochés dans une sauce tomate épicée aux poivrons, un plat savoureux et coloré.",
    difficultyLevel: "EASY",
    preparationTime: 15,
    cookingTime: 25,
    servings: 3,
    imageUrl: null,
    creationDate: "2024-03-20T09:00:00",
    updateDate: "2024-03-20T09:00:00",
    isApproved: true,
    averageRating: 4.4,
    totalRatings: 39,
    totalComments: 8,
    user: { id: 6, username: "Omar", lastName: "Benjelloun", email: "omar@cuisenio.com", profilePicture: null },
    categories: [{ id: 2, name: "Plats principaux", type: "MAIN" }],
    recipeIngredients: [],
    steps: [],
  },
]

const fakeComments = [
  { id: 1, recipeId: 1, content: "Délicieux ! Ma famille a adoré cette recette.", createdAt: "2024-03-02T15:30:00", approved: true, user: { id: 2, username: "Ahmed", lastName: "Karim" } },
  { id: 2, recipeId: 1, content: "Recette parfaite, très authentique !", createdAt: "2024-03-03T10:00:00", approved: true, user: { id: 3, username: "Fatima", lastName: "Zahra" } },
  { id: 3, recipeId: 2, content: "J'ai ajouté un peu plus de cumin, c'était encore meilleur.", createdAt: "2024-03-04T18:45:00", approved: true, user: { id: 5, username: "Sara", lastName: "Idrissi" } },
]

const recipeReports = []
const commentReports = []

let fakeMealPlans = [
  {
    id: 1, recipeId: 1, userId: 1,
    planningDate: "2026-03-17", dayOfWeek: "TUESDAY", mealType: "DINNER", servings: 4, notes: "Repas en famille",
    recipe: { id: 1, title: "Tajine de Poulet aux Citrons Confits", description: "Un tajine savoureux", difficultyLevel: "EASY", preparationTime: 30, cookingTime: 60, servings: 4, imageUrl: null },
  },
  {
    id: 2, recipeId: 7, userId: 1,
    planningDate: "2026-03-18", dayOfWeek: "WEDNESDAY", mealType: "BREAKFAST", servings: 2, notes: "Petit déjeuner",
    recipe: { id: 7, title: "Thé à la Menthe", description: "Le célèbre thé à la menthe", difficultyLevel: "EASY", preparationTime: 10, cookingTime: 5, servings: 4, imageUrl: null },
  },
  {
    id: 3, recipeId: 2, userId: 1,
    planningDate: "2026-03-19", dayOfWeek: "THURSDAY", mealType: "LUNCH", servings: 4, notes: "",
    recipe: { id: 2, title: "Harira Marocaine", description: "La soupe traditionnelle", difficultyLevel: "EASY", preparationTime: 20, cookingTime: 45, servings: 6, imageUrl: null },
  },
]

const resetTokens = new Map()
for (const recipe of fakeRecipes) {
  if (!recipe.status) {
    recipe.status = recipe.isApproved ? "published" : "pending_review"
  }
  if (typeof recipe.isFeatured !== "boolean") recipe.isFeatured = false
  if (typeof recipe.isPremium !== "boolean") recipe.isPremium = false
  if (!Array.isArray(recipe.kitchenTools)) recipe.kitchenTools = []
  if (!recipe.instructions) recipe.instructions = recipe.steps?.map((step) => step.description).join("\n") || ""
  if (!recipe.videoUrl) recipe.videoUrl = null
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function pageResponse(content, page = 0, size = 10) {
  const totalElements = content.length
  const totalPages = Math.ceil(totalElements / size)
  const sliced = content.slice(page * size, page * size + size)
  return {
    content: sliced, totalElements, totalPages, size, number: page,
    pageable: { pageNumber: page, pageSize: size, sort: { empty: true, sorted: false, unsorted: true }, offset: page * size, paged: true, unpaged: false },
    last: page >= totalPages - 1, first: page === 0, numberOfElements: sliced.length, empty: sliced.length === 0,
    sort: { empty: true, sorted: false, unsorted: true },
  }
}

function getUserBadge(userId) {
  const userRecipes = fakeRecipes.filter((recipe) => recipe.user?.id === userId && recipe.status === "published")
  const publishedCount = userRecipes.length
  const ratingScore = userRecipes.reduce((sum, recipe) => sum + (recipe.totalRatings || 0), 0)
  if (publishedCount >= 5 && ratingScore >= 180) return "Verified"
  if (publishedCount >= 2 && ratingScore >= 60) return "Chef"
  return "Beginner"
}

function decorateRecipe(recipe) {
  if (!recipe?.user) return recipe
  return {
    ...recipe,
    user: {
      ...recipe.user,
      badge: getUserBadge(recipe.user.id),
    },
  }
}

function isNotArchived(entity) {
  return !entity?.isArchived && !entity?.is_archived
}

function softArchive(entity) {
  entity.isArchived = true
  entity.archivedAt = new Date().toISOString()
  return entity
}

function toTagSlug(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function normalizeQuantity(quantity, unit) {
  const value = Number(quantity)
  if (!Number.isFinite(value) || value <= 0) return null
  const normalizedUnit = String(unit || "").trim().toLowerCase()
  const massMap = { g: 1, gram: 1, grams: 1, kg: 1000 }
  const volumeMap = { ml: 1, milliliter: 1, milliliters: 1, l: 1000 }
  if (normalizedUnit in massMap) {
    return { normalizedQuantity: value * massMap[normalizedUnit], normalizedUnit: "g" }
  }
  if (normalizedUnit in volumeMap) {
    return { normalizedQuantity: value * volumeMap[normalizedUnit], normalizedUnit: "ml" }
  }
  return null
}

function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  })
  res.end(JSON.stringify(data))
}

function sendSuccess(res, data, status = 200, meta = {}) {
  sendJSON(
    res,
    {
      success: true,
      data,
      meta: {
        requestId: `req_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    status,
  )
}

function sendApiError(res, status, code, message, details) {
  sendJSON(
    res,
    {
      success: false,
      error: { code, message, details },
      meta: { requestId: `req_${Date.now()}`, timestamp: new Date().toISOString() },
    },
    status,
  )
}

function getCurrentUser(req) {
  const authHeader = req.headers["authorization"] || ""
  const token = authHeader.replace("Bearer ", "")
  if (!token.startsWith(`${FAKE_TOKEN_PREFIX}-`)) return null
  const userId = Number(token.replace(`${FAKE_TOKEN_PREFIX}-`, ""))
  if (!Number.isFinite(userId)) return null
  return fakeUsers.find((u) => u.id === userId) || null
}

function ensureAdmin(req, res) {
  const user = getCurrentUser(req)
  if (!user) {
    sendApiError(res, 401, "UNAUTHORIZED", "Non authentifié.")
    return null
  }
  if (user.role !== "ADMIN") {
    sendApiError(res, 403, "FORBIDDEN", "Accès réservé aux administrateurs.")
    return null
  }
  return user
}

function checkSubscription(user) {
  if (!user) return false
  return user.role === "ADMIN" || user.subscriptionTier === "PRO"
}

function sanitizeRecipeForViewer(recipe, viewer) {
  const canAccessPremium = checkSubscription(viewer)
  if (!recipe?.isPremium || canAccessPremium) {
    return { ...recipe, premiumLocked: false }
  }
  return {
    ...recipe,
    premiumLocked: true,
    instructions: null,
    videoUrl: null,
    steps: [],
  }
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = ""
    req.on("data", (chunk) => (body += chunk))
    req.on("end", () => {
      try { resolve(JSON.parse(body)) } catch { resolve({}) }
    })
  })
}

// ── Router ─────────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true)
  const pathname = parsed.pathname.replace(/\/$/, "") || "/"
  const method = req.method
  const query = parsed.query

  // Preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    })
    return res.end()
  }

  console.log(`${method} ${pathname}`)

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (method === "POST" && pathname === "/v1/auth/login") {
    const body = await parseBody(req)
    const matchedUser = fakeUsers.find((u) => u.email === body.email)
    // Always return the same generic error to prevent email enumeration
    if (!matchedUser || matchedUser.password !== body.password) {
      return sendJSON(res, { message: "Email ou mot de passe incorrect." }, 401)
    }
    if (matchedUser.status === "suspended") {
      return sendJSON(res, { message: "Votre compte a été bloqué. Contactez l'administrateur." }, 403)
    }
    if (matchedUser.status === "archived") {
      return sendJSON(res, { message: "Votre compte est archivé." }, 403)
    }
    const { registrationDate, password, ...userPayload } = matchedUser
    return sendJSON(res, { token: `${FAKE_TOKEN_PREFIX}-${matchedUser.id}`, ...userPayload, profilePicture: null })
  }

  if (method === "POST" && pathname === "/v1/auth/register") {
    const body = await parseBody(req)
    if (!body.email || !body.password || !body.username) {
      return sendJSON(res, { message: "Données d'inscription incomplètes." }, 400)
    }
    if (fakeUsers.find((u) => u.email === body.email)) {
      return sendJSON(res, { message: "Cet email est déjà utilisé." }, 409)
    }
    // Role is ALWAYS USER — the server decides, the client never sends it
    const newUser = {
      id: fakeUsers.length + 1,
      username: body.username,
      lastName: body.lastName || "",
      email: body.email,
      password: body.password,
      role: "CHEF",
      registrationDate: new Date().toISOString(),
      status: "active",
      subscriptionTier: "FREE",
      isShadowBanned: false,
    }
    fakeUsers.push(newUser)
    const { registrationDate, password, ...userPayload } = newUser
    return sendJSON(res, { token: `${FAKE_TOKEN_PREFIX}-${newUser.id}`, ...userPayload, profilePicture: null }, 201)
  }

  if (method === "POST" && pathname === "/v1/auth/forgot-password") {
    const body = await parseBody(req)
    const target = fakeUsers.find((u) => u.email === body.email)
    if (target) {
      const token = `reset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      resetTokens.set(token, { userId: target.id, expiresAt: Date.now() + 1000 * 60 * 15 })
      console.log(`[mock-smtp] reset link for ${target.email}: http://localhost:5173/auth/reset-password/${token}`)
    }
    return sendJSON(res, { message: "If this email exists, a reset link was sent." })
  }

  const verifyResetMatch = pathname.match(/^\/v1\/auth\/reset-password\/verify\/(.+)$/)
  if (method === "GET" && verifyResetMatch) {
    const token = verifyResetMatch[1]
    const payload = resetTokens.get(token)
    const valid = !!payload && payload.expiresAt > Date.now()
    return sendJSON(res, { valid })
  }

  if (method === "POST" && pathname === "/v1/auth/reset-password") {
    const body = await parseBody(req)
    const payload = resetTokens.get(body.token)
    if (!payload || payload.expiresAt <= Date.now()) {
      return sendJSON(res, { message: "Invalid or expired reset token." }, 400)
    }
    const target = fakeUsers.find((u) => u.id === payload.userId)
    if (!target) return sendJSON(res, { message: "User not found." }, 404)
    target.password = body.newPassword
    resetTokens.delete(body.token)
    return sendJSON(res, { message: "Password reset successful." })
  }

  if (method === "POST" && pathname === "/v1/auth/verify-token") {
    const authHeader = req.headers["authorization"] || ""
    const token = authHeader.replace("Bearer ", "")
    if (!token.startsWith(`${FAKE_TOKEN_PREFIX}-`)) {
      return sendJSON(res, { valid: false }, 401)
    }
    return sendJSON(res, { valid: true })
  }

  // ── Profile ───────────────────────────────────────────────────────────────
  // Resolve current user from token (in mock: always the admin for simplicity,
  // but a real server would decode the JWT)
  const currentUser = getCurrentUser(req)
  const isAuthed = !!currentUser
  if (!isAuthed && !pathname.startsWith("/v1/auth")) {
    return sendJSON(res, { message: "Non authentifié." }, 401)
  }

  if (method === "GET" && pathname === "/v1/profile") {
    const { registrationDate, password, ...profile } = currentUser
    return sendJSON(res, { ...profile, profilePicture: null })
  }

  if (method === "PUT" && pathname === "/v1/profile") {
    const { registrationDate, password, ...profile } = currentUser
    return sendJSON(res, { ...profile, profilePicture: null })
  }

  if (method === "PUT" && pathname === "/v1/profile/password") {
    const body = await parseBody(req)
    if (!currentUser) return sendJSON(res, { message: "Non authentifie." }, 401)
    if (!body.currentPassword || !body.newPassword) {
      return sendJSON(res, { message: "Donnees invalides." }, 400)
    }
    if (body.currentPassword !== currentUser.password) {
      return sendJSON(res, { message: "Mot de passe actuel incorrect." }, 400)
    }
    if (body.currentPassword === body.newPassword) {
      return sendJSON(res, { message: "Le nouveau mot de passe doit etre different." }, 400)
    }
    currentUser.password = body.newPassword
    return sendJSON(res, { message: "Password updated" })
  }

  if (method === "DELETE" && pathname === "/v1/profile") {
    return sendJSON(res, { message: "Account deleted" })
  }

  // ── Recipes ───────────────────────────────────────────────────────────────
  if (method === "GET" && pathname === "/api/recipes") {
    const page = parseInt(query.page || "0")
    const size = parseInt(query.size || "9")
    const publishedRecipes = fakeRecipes
      .filter((recipe) => recipe.status === "published" && isNotArchived(recipe))
      .map((recipe) => sanitizeRecipeForViewer(decorateRecipe(recipe), currentUser))
    return sendJSON(res, pageResponse(publishedRecipes, page, size))
  }

  if (method === "GET" && pathname === "/api/homepage/hero") {
    const heroRecipes = fakeRecipes
      .filter((recipe) => recipe.status === "published" && isNotArchived(recipe))
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
      .slice(0, 6)
      .map((recipe) => sanitizeRecipeForViewer(decorateRecipe(recipe), currentUser))
    return sendSuccess(res, heroRecipes)
  }

  if (method === "GET" && pathname === "/api/recipes/saved") {
    return sendJSON(res, pageResponse(fakeRecipes.filter(isNotArchived).slice(0, 3)))
  }

  if (method === "GET" && pathname === "/api/recipes/search") {
    const q = (query.title || query.q || "").toLowerCase()
    const base = fakeRecipes.filter((recipe) => recipe.status === "published" && isNotArchived(recipe))
    const filtered = q ? base.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) : base
    const hydrated = filtered.map((recipe) => sanitizeRecipeForViewer(decorateRecipe(recipe), currentUser))
    return sendJSON(res, pageResponse(hydrated))
  }

  const recipeDetailMatch = pathname.match(/^\/api\/recipes\/(\d+)$/)
  if (method === "GET" && recipeDetailMatch) {
    const recipe = fakeRecipes.find((r) => r.id === parseInt(recipeDetailMatch[1]) && isNotArchived(r))
    return recipe
      ? sendJSON(res, sanitizeRecipeForViewer(decorateRecipe(recipe), currentUser))
      : sendJSON(res, { error: "Not found" }, 404)
  }

  if (method === "POST" && pathname === "/api/recipes") {
    const body = await parseBody(req)
    const nextStatus = ["draft", "pending_review", "published", "rejected"].includes(body.status)
      ? body.status
      : "pending_review"
    const newRecipe = {
      id: fakeRecipes.length + 1,
      isApproved: nextStatus === "published",
      status: nextStatus,
      averageRating: 0,
      totalRatings: 0,
      totalComments: 0,
      creationDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
      imageUrl: null,
      recipeIngredients: [],
      steps: [],
      isFeatured: false,
      isPremium: false,
      kitchenTools: [],
      instructions: "",
      videoUrl: null,
      ...body,
    }
    fakeRecipes.unshift(newRecipe)
    return sendJSON(res, decorateRecipe(newRecipe), 201)
  }

  const submitReviewMatch = pathname.match(/^\/api\/recipes\/(\d+)\/submit-review$/)
  if (method === "PATCH" && submitReviewMatch) {
    const recipeId = parseInt(submitReviewMatch[1])
    const recipe = fakeRecipes.find((r) => r.id === recipeId)
    if (!recipe) return sendJSON(res, { message: "Recipe not found" }, 404)
    recipe.status = "pending_review"
    recipe.isApproved = false
    recipe.updateDate = new Date().toISOString()
    return sendJSON(res, decorateRecipe(recipe))
  }

  const reportRecipeMatch = pathname.match(/^\/api\/recipes\/(\d+)\/report$/)
  if (method === "POST" && reportRecipeMatch) {
    const recipeId = parseInt(reportRecipeMatch[1])
    const targetRecipe = fakeRecipes.find((recipe) => recipe.id === recipeId)
    if (!targetRecipe) return sendApiError(res, 404, "NOT_FOUND", "Recipe not found")
    const body = await parseBody(req)
    const reason = String(body.reason || "").trim() || "Community report"
    recipeReports.push({
      id: recipeReports.length + 1,
      recipeId,
      reporterUserId: currentUser.id,
      reason,
      createdAt: new Date().toISOString(),
    })
    const reportCount = recipeReports.filter((report) => report.recipeId === recipeId).length
    return sendSuccess(res, { recipeId, reportCount }, 201)
  }

  const reportCommentMatch = pathname.match(/^\/api\/recipes\/(\d+)\/comments\/(\d+)\/report$/)
  if (method === "POST" && reportCommentMatch) {
    const recipeId = parseInt(reportCommentMatch[1])
    const commentId = parseInt(reportCommentMatch[2])
    const targetComment = fakeComments.find((comment) => comment.id === commentId && comment.recipeId === recipeId)
    if (!targetComment) return sendApiError(res, 404, "NOT_FOUND", "Comment not found")
    const body = await parseBody(req)
    const reason = String(body.reason || "").trim() || "Community report"
    commentReports.push({
      id: commentReports.length + 1,
      recipeId,
      commentId,
      reporterUserId: currentUser.id,
      reason,
      createdAt: new Date().toISOString(),
    })
    const reportCount = commentReports.filter((report) => report.commentId === commentId).length
    return sendSuccess(res, { recipeId, commentId, reportCount }, 201)
  }

  if (method === "DELETE" && recipeDetailMatch) {
    const recipe = fakeRecipes.find((r) => r.id === parseInt(recipeDetailMatch[1]))
    if (!recipe) return sendApiError(res, 404, "NOT_FOUND", "Recipe not found")
    // Soft delete — never hard DELETE
    softArchive(recipe)
    return sendJSON(res, { message: "Archived" })
  }

  const recipeRestoreMatch = pathname.match(/^\/api\/admin\/recipes\/(\d+)\/restore$/)
  if (method === "PUT" && recipeRestoreMatch) {
    if (!ensureAdmin(req, res)) return
    const recipe = fakeRecipes.find((r) => r.id === parseInt(recipeRestoreMatch[1]))
    if (!recipe) return sendApiError(res, 404, "NOT_FOUND", "Recipe not found")
    recipe.isArchived = false
    recipe.archivedAt = null
    return sendSuccess(res, decorateRecipe(recipe))
  }

  const recipeCommentsMatch = pathname.match(/^\/api\/recipes\/(\d+)\/comments$/)
  if (method === "GET" && recipeCommentsMatch) {
    const recipeId = parseInt(recipeCommentsMatch[1])
    const visibleComments = fakeComments.filter((comment) => {
      if (comment.recipeId !== recipeId) return false
      const commentAuthor = fakeUsers.find((u) => u.id === comment.user?.id)
      if (!commentAuthor?.isShadowBanned) return true
      return currentUser.role === "ADMIN" || currentUser.id === commentAuthor.id
    })
    return sendJSON(res, visibleComments)
  }

  if (method === "POST" && recipeCommentsMatch) {
    const body = await parseBody(req)
    const recipeId = parseInt(recipeCommentsMatch[1])
    const comment = {
      id: fakeComments.length + 1,
      recipeId,
      content: body.content,
      createdAt: new Date().toISOString(),
      approved: false,
      user: { id: currentUser.id, username: currentUser.username, lastName: currentUser.lastName },
    }
    fakeComments.push(comment)
    const recipe = fakeRecipes.find((r) => r.id === recipeId)
    if (recipe?.user?.id) {
      pushNotification({
        recipientId: recipe.user.id,
        type: "COMMENT",
        message: `${currentUser.username} a laissé un commentaire sur votre recette « ${recipe.title} »`,
        targetUrl: `/recipe/${recipeId}`,
        actor: currentUser,
      })
    }
    return sendJSON(res, comment, 201)
  }

  const addImageMatch = pathname.match(/^\/api\/recipes\/add-image\/(\d+)$/)
  if (method === "POST" && addImageMatch) {
    return sendJSON(res, { message: "Image uploaded" })
  }

  // ── Categories ────────────────────────────────────────────────────────────
  if (method === "GET" && pathname === "/v1/admin/tags") {
    if (!ensureAdmin(req, res)) return
    const tags = fakeCategories.map((category) => ({ ...category, slug: toTagSlug(category.name) }))
    return sendSuccess(res, pageResponse(tags, 0, tags.length || 1))
  }

  if (method === "POST" && pathname === "/v1/admin/tags") {
    if (!ensureAdmin(req, res)) return
    const body = await parseBody(req)
    if (!body.name || !String(body.name).trim()) {
      return sendApiError(res, 400, "VALIDATION_ERROR", "Tag name is required")
    }
    const nextName = String(body.name).trim()
    const exists = fakeCategories.some((category) => category.name.toLowerCase() === nextName.toLowerCase())
    if (exists) return sendApiError(res, 409, "CONFLICT", "Tag already exists")
    const createdTag = { id: fakeCategories.length + 1, name: nextName }
    fakeCategories.push(createdTag)
    return sendSuccess(res, { ...createdTag, slug: toTagSlug(createdTag.name) }, 201)
  }

  const adminTagMatch = pathname.match(/^\/v1\/admin\/tags\/(\d+)$/)
  if (method === "PATCH" && adminTagMatch) {
    if (!ensureAdmin(req, res)) return
    const body = await parseBody(req)
    const nextName = String(body.name || "").trim()
    if (!nextName) return sendApiError(res, 400, "VALIDATION_ERROR", "Tag name is required")
    const tagId = parseInt(adminTagMatch[1])
    const targetTag = fakeCategories.find((category) => category.id === tagId)
    if (!targetTag) return sendApiError(res, 404, "NOT_FOUND", "Tag not found")
    targetTag.name = nextName
    for (const recipe of fakeRecipes) {
      if (!Array.isArray(recipe.categories)) continue
      recipe.categories = recipe.categories.map((category) =>
        category.id === tagId ? { ...category, name: nextName } : category,
      )
    }
    return sendSuccess(res, { ...targetTag, slug: toTagSlug(targetTag.name) })
  }

  if (method === "GET" && pathname === "/v1/categories/count") {
    return sendJSON(res, { count: fakeCategories.length })
  }

  if (method === "GET" && pathname === "/v1/categories") {
    const page = parseInt(query.page || "0")
    const size = parseInt(query.size || "10")
    return sendJSON(res, pageResponse(fakeCategories, page, size))
  }

  if (method === "POST" && pathname === "/v1/categories") {
    const body = await parseBody(req)
    const cat = { id: fakeCategories.length + 1, name: body.name }
    fakeCategories.push(cat)
    return sendJSON(res, cat, 201)
  }

  const catDetailMatch = pathname.match(/^\/v1\/categories\/(\d+)$/)
  if (method === "DELETE" && catDetailMatch) {
    fakeCategories = fakeCategories.filter((c) => c.id !== parseInt(catDetailMatch[1]))
    return sendJSON(res, { message: "Deleted" })
  }

  // ── Ingredients ───────────────────────────────────────────────────────────
  if (method === "GET" && pathname === "/v1/admin/master-ingredients") {
    if (!ensureAdmin(req, res)) return
    return sendSuccess(res, pageResponse(masterIngredients, 0, masterIngredients.length || 1))
  }

  if (method === "POST" && pathname === "/v1/admin/master-ingredients") {
    if (!ensureAdmin(req, res)) return
    const body = await parseBody(req)
    const canonicalName = String(body.canonicalName || "").trim()
    if (!canonicalName) return sendApiError(res, 400, "VALIDATION_ERROR", "canonicalName is required")
    const found = masterIngredients.find((item) => item.canonicalName.toLowerCase() === canonicalName.toLowerCase())
    if (found) return sendApiError(res, 409, "CONFLICT", "Master ingredient already exists")
    const created = { id: masterIngredients.length + 1, canonicalName }
    masterIngredients.push(created)
    return sendSuccess(res, created, 201)
  }

  if (method === "POST" && pathname === "/v1/admin/ingredients/alias") {
    if (!ensureAdmin(req, res)) return
    const body = await parseBody(req)
    const aliasName = String(body.aliasName || "").trim()
    const masterIngredientId = Number(body.masterIngredientId)
    if (!aliasName || !Number.isFinite(masterIngredientId)) {
      return sendApiError(res, 400, "VALIDATION_ERROR", "aliasName and masterIngredientId are required")
    }
    const master = masterIngredients.find((item) => item.id === masterIngredientId)
    if (!master) return sendApiError(res, 404, "NOT_FOUND", "Master ingredient not found")
    let alias = fakeIngredients.find((item) => item.name.toLowerCase() === aliasName.toLowerCase())
    if (!alias) {
      alias = { id: fakeIngredients.length + 1, name: aliasName, masterIngredientId }
      fakeIngredients.push(alias)
    } else {
      alias.masterIngredientId = masterIngredientId
      alias.name = aliasName
    }
    for (const recipe of fakeRecipes) {
      if (!Array.isArray(recipe.recipeIngredients)) continue
      recipe.recipeIngredients = recipe.recipeIngredients.map((item) => {
        const ingredientName = String(item.ingredient?.name || "").toLowerCase()
        if (ingredientName !== aliasName.toLowerCase()) return item
        return {
          ...item,
          ingredient: {
            ...item.ingredient,
            id: master.id,
            name: master.canonicalName,
          },
        }
      })
    }
    return sendSuccess(res, alias)
  }

  if (method === "POST" && pathname === "/v1/ingredients/normalize-quantity") {
    const body = await parseBody(req)
    const normalized = normalizeQuantity(body.quantity, body.unit)
    if (!normalized) {
      return sendApiError(
        res,
        400,
        "VALIDATION_ERROR",
        "Unsupported unit or invalid quantity. Use g/kg/ml/l with positive quantity.",
      )
    }
    return sendSuccess(res, {
      sourceQuantity: Number(body.quantity),
      sourceUnit: body.unit,
      normalizedQuantity: normalized.normalizedQuantity,
      normalizedUnit: normalized.normalizedUnit,
    })
  }

  if (method === "GET" && pathname === "/v1/ingredients/count") {
    return sendJSON(res, { count: fakeIngredients.length })
  }

  if (method === "GET" && pathname === "/v1/ingredients") {
    return sendJSON(res, pageResponse(fakeIngredients, 0, 50))
  }

  if (method === "POST" && pathname === "/v1/ingredients") {
    const body = await parseBody(req)
    const ing = { id: fakeIngredients.length + 1, name: body.name }
    fakeIngredients.push(ing)
    return sendJSON(res, ing, 201)
  }

  const ingDetailMatch = pathname.match(/^\/v1\/ingredients\/(\d+)$/)
  if (method === "DELETE" && ingDetailMatch) {
    fakeIngredients = fakeIngredients.filter((i) => i.id !== parseInt(ingDetailMatch[1]))
    return sendJSON(res, { message: "Deleted" })
  }

  // ── Admin Users ───────────────────────────────────────────────────────────
  if (method === "GET" && pathname === "/v1/admin/users/count") {
    if (!ensureAdmin(req, res)) return
    return sendSuccess(res, { count: fakeUsers.length })
  }

  if (method === "GET" && pathname === "/v1/admin/users") {
    if (!ensureAdmin(req, res)) return
    // Never expose passwords; strip sensitive fields — exclude soft-deleted
    const safeUsers = fakeUsers
      .filter(isNotArchived)
      .map(({ password, ...rest }) => ({ ...rest, isblocked: rest.status === "suspended", badge: getUserBadge(rest.id) }))
    return sendSuccess(res, pageResponse(safeUsers))
  }

  if (method === "GET" && pathname === "/v1/admin/overview") {
    if (!ensureAdmin(req, res)) return
    const totalUsers = fakeUsers.length
    const activeRecipes = fakeRecipes.filter((r) => r.status === "published").length
    const likes = fakeRecipes.reduce((sum, recipe) => sum + (recipe.totalRatings || 0), 0)
    const comments = fakeRecipes.reduce((sum, recipe) => sum + (recipe.totalComments || 0), 0)
    const engagementRate = totalUsers === 0 ? 0 : ((likes + comments) / totalUsers) * 100
    return sendSuccess(res, { totalUsers, activeRecipes, engagementRate, likes, comments })
  }

  const userStatusMatch = pathname.match(/^\/v1\/admin\/users\/(\d+)\/status$/)
  if (method === "PATCH" && userStatusMatch) {
    if (!ensureAdmin(req, res)) return
    const userId = parseInt(userStatusMatch[1])
    const body = await parseBody(req)
    const nextStatus = body.status
    const target = fakeUsers.find((u) => u.id === userId)
    if (!target) return sendApiError(res, 404, "NOT_FOUND", "User not found")
    if (target.email === ADMIN_EMAIL) return sendApiError(res, 403, "FORBIDDEN", "Cannot update admin status")
    if (!["active", "suspended", "archived"].includes(nextStatus)) {
      return sendApiError(res, 400, "VALIDATION_ERROR", "Invalid status value")
    }
    target.status = nextStatus
    const { password, ...safeUser } = target
    return sendSuccess(res, { ...safeUser, isblocked: safeUser.status === "suspended" })
  }

  const userRoleMatch = pathname.match(/^\/v1\/admin\/users\/(\d+)\/role$/)
  if (method === "PATCH" && userRoleMatch) {
    if (!ensureAdmin(req, res)) return
    const userId = parseInt(userRoleMatch[1])
    const body = await parseBody(req)
    let nextRole = String(body.role || "").toUpperCase().replace(/^ROLE_/, "")
    if (nextRole === "USER") nextRole = "CHEF"
    const target = fakeUsers.find((u) => u.id === userId)
    if (!target) return sendApiError(res, 404, "NOT_FOUND", "User not found")
    if (target.email === ADMIN_EMAIL) return sendApiError(res, 403, "FORBIDDEN", "Cannot change admin role")
    if (!["CHEF", "PREMIUM"].includes(nextRole)) {
      return sendApiError(res, 400, "VALIDATION_ERROR", "Role must be CHEF or PREMIUM")
    }
    target.role = nextRole
    target.subscriptionTier = nextRole === "PREMIUM" ? "PRO" : "FREE"
    const { password, ...safeUser } = target
    return sendSuccess(res, { ...safeUser, isblocked: safeUser.status === "suspended" })
  }

  // ── Admin Newsletter ──────────────────────────────────────────────────────
  if (method === "GET" && pathname === "/v1/admin/newsletter/subscribers") {
    if (!ensureAdmin(req, res)) return
    return sendSuccess(res, fakeNewsletterSubscribers.filter(isNotArchived))
  }

  const newsletterUnsubMatch = pathname.match(/^\/v1\/admin\/newsletter\/subscribers\/(\d+)\/unsubscribe$/)
  if (method === "POST" && newsletterUnsubMatch) {
    if (!ensureAdmin(req, res)) return
    const id = parseInt(newsletterUnsubMatch[1])
    const sub = fakeNewsletterSubscribers.find((s) => s.id === id && isNotArchived(s))
    if (!sub) return sendApiError(res, 404, "NOT_FOUND", "Subscriber not found")
    sub.active = false
    return sendSuccess(res, sub)
  }

  const newsletterDetailMatch = pathname.match(/^\/v1\/admin\/newsletter\/subscribers\/(\d+)$/)
  if (method === "DELETE" && newsletterDetailMatch) {
    if (!ensureAdmin(req, res)) return
    const id = parseInt(newsletterDetailMatch[1])
    const sub = fakeNewsletterSubscribers.find((s) => s.id === id)
    if (!sub) return sendApiError(res, 404, "NOT_FOUND", "Subscriber not found")
    softArchive(sub)
    sub.active = false
    return sendSuccess(res, { message: "Archived" })
  }

  if (method === "POST" && pathname === "/api/newsletter/subscribe") {
    const body = await parseBody(req)
    const email = String(body.email || "").trim().toLowerCase()
    if (!email || !body.consent) {
      return sendApiError(res, 400, "VALIDATION_ERROR", "Email et consentement requis")
    }
    const existing = fakeNewsletterSubscribers.find((s) => s.email.toLowerCase() === email)
    if (existing) {
      if (existing.active) {
        return sendJSON(res, { message: "Cet email est déjà inscrit à la newsletter Cuisenio.", alreadySubscribed: true })
      }
      existing.active = true
      existing.consentGiven = true
      return sendJSON(res, { message: "Bienvenue de nouveau dans la newsletter Cuisenio.", alreadySubscribed: false })
    }
    fakeNewsletterSubscribers.push({
      id: fakeNewsletterSubscribers.reduce((max, s) => Math.max(max, s.id), 0) + 1,
      email,
      subscribedAt: new Date().toISOString(),
      active: true,
      consentGiven: true,
      origin: "Home Page",
    })
    return sendJSON(res, { message: "Inscription newsletter confirmée.", alreadySubscribed: false }, 201)
  }

  const userArchiveMatch = pathname.match(/^\/v1\/admin\/users\/(\d+)\/archive$/)
  if (method === "GET" && userArchiveMatch) {
    if (!ensureAdmin(req, res)) return
    const userId = parseInt(userArchiveMatch[1])
    const target = fakeUsers.find((u) => u.id === userId)
    if (!target) return sendApiError(res, 404, "NOT_FOUND", "User not found")

    const posts = fakeRecipes
      .filter((recipe) => recipe.user?.id === userId)
      .map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        createdAt: recipe.creationDate,
        totalComments: recipe.totalComments || 0,
        totalRatings: recipe.totalRatings || 0,
      }))

    const logs = [
      { id: 1, type: "LOGIN", description: "Connexion utilisateur", createdAt: target.registrationDate },
      { id: 2, type: "STATUS_CHANGED", description: `Status actuel: ${target.status}`, createdAt: new Date().toISOString() },
      ...posts.map((post, index) => ({
        id: index + 10,
        type: "RECIPE_CREATED",
        description: `Publication: ${post.title}`,
        createdAt: post.createdAt,
      })),
    ]

    const { password, ...safeUser } = target
    return sendSuccess(res, {
      user: { ...safeUser, isblocked: safeUser.status === "suspended" },
      posts,
      activityLogs: logs,
    })
  }

  if (method === "GET" && pathname === "/v1/admin/recipes/moderation-queue") {
    if (!ensureAdmin(req, res)) return
    const pending = fakeRecipes.filter((recipe) => recipe.status === "pending_review").map(decorateRecipe)
    return sendSuccess(res, pageResponse(pending))
  }

  const approveMatch = pathname.match(/^\/admin\/recipes\/approve\/(\d+)$/)
  if (method === "PATCH" && approveMatch) {
    if (!ensureAdmin(req, res)) return
    const recipeId = parseInt(approveMatch[1])
    const recipe = fakeRecipes.find((r) => r.id === recipeId)
    if (!recipe) return sendApiError(res, 404, "NOT_FOUND", "Recipe not found")
    if (recipe.status !== "pending_review") {
      return sendApiError(res, 409, "INVALID_STATE", "Only pending recipes can be approved")
    }
    recipe.status = "published"
    recipe.isApproved = true
    recipe.updateDate = new Date().toISOString()
    if (recipe.user?.id) {
      pushNotification({
        recipientId: recipe.user.id,
        type: "RECIPE_APPROVED",
        message: `Votre recette « ${recipe.title} » a été validée et est maintenant visible.`,
        targetUrl: `/recipe/${recipeId}`,
        actor: currentUser,
      })
    }
    return sendSuccess(res, decorateRecipe(recipe))
  }

  const adminApprovePut = pathname.match(/^\/api\/admin\/recipes\/(\d+)\/approve$/)
  if (method === "PUT" && adminApprovePut) {
    if (!ensureAdmin(req, res)) return
    const recipeId = parseInt(adminApprovePut[1])
    const recipe = fakeRecipes.find((r) => r.id === recipeId)
    if (!recipe) return sendApiError(res, 404, "NOT_FOUND", "Recipe not found")
    recipe.status = "published"
    recipe.isApproved = true
    recipe.updateDate = new Date().toISOString()
    if (recipe.user?.id) {
      pushNotification({
        recipientId: recipe.user.id,
        type: "RECIPE_APPROVED",
        message: `Votre recette « ${recipe.title} » a été validée et est maintenant visible.`,
        targetUrl: `/recipe/${recipeId}`,
        actor: currentUser,
      })
    }
    return sendSuccess(res, decorateRecipe(recipe))
  }

  const moderationMatch = pathname.match(/^\/v1\/admin\/recipes\/(\d+)\/moderation$/)
  if (method === "PATCH" && moderationMatch) {
    if (!ensureAdmin(req, res)) return
    const recipeId = parseInt(moderationMatch[1])
    const body = await parseBody(req)
    const status = body.status
    if (!["published", "rejected"].includes(status)) {
      return sendApiError(res, 400, "VALIDATION_ERROR", "Invalid moderation status")
    }
    const recipe = fakeRecipes.find((r) => r.id === recipeId)
    if (!recipe) return sendApiError(res, 404, "NOT_FOUND", "Recipe not found")
    recipe.status = status
    recipe.isApproved = status === "published"
    recipe.updateDate = new Date().toISOString()
    return sendSuccess(res, decorateRecipe(recipe))
  }

  const promotionMatch = pathname.match(/^\/v1\/admin\/recipes\/(\d+)\/promotion$/)
  if (method === "PATCH" && promotionMatch) {
    if (!ensureAdmin(req, res)) return
    const recipeId = parseInt(promotionMatch[1])
    const recipe = fakeRecipes.find((r) => r.id === recipeId)
    if (!recipe) return sendApiError(res, 404, "NOT_FOUND", "Recipe not found")
    const body = await parseBody(req)
    if (typeof body.isFeatured === "boolean") recipe.isFeatured = body.isFeatured
    if (typeof body.isPremium === "boolean") recipe.isPremium = body.isPremium
    if (Array.isArray(body.kitchenTools)) {
      recipe.kitchenTools = body.kitchenTools
        .filter((tool) => tool && tool.name)
        .map((tool) => ({ name: String(tool.name).trim(), affiliateUrl: tool.affiliateUrl ? String(tool.affiliateUrl).trim() : "" }))
    }
    recipe.updateDate = new Date().toISOString()
    return sendSuccess(res, decorateRecipe(recipe))
  }

  if (method === "GET" && pathname === "/v1/admin/moderation/reports") {
    if (!ensureAdmin(req, res)) return
    const grouped = new Map()
    for (const report of recipeReports) {
      const current = grouped.get(report.recipeId) || {
        recipeId: report.recipeId,
        reportCount: 0,
        latestReason: report.reason,
        lastReportedAt: report.createdAt,
      }
      current.reportCount += 1
      if (new Date(report.createdAt).getTime() > new Date(current.lastReportedAt).getTime()) {
        current.latestReason = report.reason
        current.lastReportedAt = report.createdAt
      }
      grouped.set(report.recipeId, current)
    }
    const reportItems = Array.from(grouped.values())
      .map((item) => {
        const recipe = fakeRecipes.find((r) => r.id === item.recipeId)
        return {
          recipeId: item.recipeId,
          title: recipe?.title || "Unknown recipe",
          reportCount: item.reportCount,
          latestReason: item.latestReason,
          lastReportedAt: item.lastReportedAt,
          urgency: item.reportCount,
        }
      })
      .sort((a, b) => b.urgency - a.urgency)
    return sendSuccess(res, reportItems)
  }

  const userBlockMatch = pathname.match(/^\/v1\/admin\/users\/(\d+)\/(block|unblock)$/)
  if (method === "PUT" && userBlockMatch) {
    if (!ensureAdmin(req, res)) return
    const userId = parseInt(userBlockMatch[1])
    const u = fakeUsers.find((u) => u.id === userId)
    if (!u) return sendApiError(res, 404, "NOT_FOUND", "User not found")
    // Cannot block the admin account
    if (u.email === ADMIN_EMAIL) return sendApiError(res, 403, "FORBIDDEN", "Cannot block the admin account.")
    u.status = userBlockMatch[2] === "block" ? "suspended" : "active"
    return sendSuccess(res, { message: "Done" })
  }

  const userDeleteMatch = pathname.match(/^\/v1\/admin\/users\/(\d+)$/)
  if (method === "DELETE" && userDeleteMatch) {
    if (!ensureAdmin(req, res)) return
    const userId = parseInt(userDeleteMatch[1])
    const target = fakeUsers.find((u) => u.id === userId)
    if (!target) return sendApiError(res, 404, "NOT_FOUND", "User not found")
    if (target.email === ADMIN_EMAIL) return sendApiError(res, 403, "FORBIDDEN", "Cannot delete the admin account.")
    // Soft delete — never hard DELETE FROM users
    softArchive(target)
    target.status = "archived"
    return sendSuccess(res, { message: "Archived" })
  }

  // ── Notifications inbox ───────────────────────────────────────────────────
  if (method === "GET" && pathname === "/api/notifications") {
    if (!currentUser) return sendApiError(res, 401, "UNAUTHORIZED", "Login required")
    const list = fakeNotifications
      .filter((n) => n.recipientId === currentUser.id)
      .map(({ recipientId, ...rest }) => rest)
    return sendSuccess(res, list)
  }

  if (method === "GET" && pathname === "/api/notifications/unread-count") {
    if (!currentUser) return sendApiError(res, 401, "UNAUTHORIZED", "Login required")
    const count = fakeNotifications.filter((n) => n.recipientId === currentUser.id && !n.read).length
    return sendSuccess(res, { count })
  }

  const notifReadMatch = pathname.match(/^\/api\/notifications\/(\d+)\/read$/)
  if (method === "PATCH" && notifReadMatch) {
    if (!currentUser) return sendApiError(res, 401, "UNAUTHORIZED", "Login required")
    const id = parseInt(notifReadMatch[1])
    const n = fakeNotifications.find((x) => x.id === id && x.recipientId === currentUser.id)
    if (!n) return sendApiError(res, 404, "NOT_FOUND", "Notification not found")
    n.read = true
    return sendSuccess(res, { message: "OK" })
  }

  if (method === "PATCH" && pathname === "/api/notifications/read-all") {
    if (!currentUser) return sendApiError(res, 401, "UNAUTHORIZED", "Login required")
    fakeNotifications.forEach((n) => {
      if (n.recipientId === currentUser.id) n.read = true
    })
    return sendSuccess(res, { message: "OK" })
  }

  // ── Meal Planner ──────────────────────────────────────────────────────────
  if (method === "GET" && pathname === "/v1/meal-plans") {
    return sendJSON(res, fakeMealPlans)
  }

  const mealPlanCreateMatch = pathname.match(/^\/v1\/meal-plans\/(\d+)$/)
  if (method === "POST" && mealPlanCreateMatch) {
    const body = await parseBody(req)
    const recipeId = parseInt(mealPlanCreateMatch[1])
    const recipe = fakeRecipes.find((r) => r.id === recipeId) || null
    const mp = {
      id: fakeMealPlans.length + 1, recipeId, userId: 1, ...body,
      recipe: recipe ? { id: recipe.id, title: recipe.title, description: recipe.description, difficultyLevel: recipe.difficultyLevel, preparationTime: recipe.preparationTime, cookingTime: recipe.cookingTime, servings: recipe.servings, imageUrl: recipe.imageUrl } : null,
    }
    fakeMealPlans.push(mp)
    return sendJSON(res, mp, 201)
  }

  if (method === "PUT" && mealPlanCreateMatch) {
    const body = await parseBody(req)
    const id = parseInt(mealPlanCreateMatch[1])
    const idx = fakeMealPlans.findIndex((m) => m.id === id)
    if (idx !== -1) fakeMealPlans[idx] = { ...fakeMealPlans[idx], ...body }
    return sendJSON(res, fakeMealPlans[idx] || {})
  }

  if (method === "DELETE" && mealPlanCreateMatch) {
    const id = parseInt(mealPlanCreateMatch[1])
    fakeMealPlans = fakeMealPlans.filter((m) => m.id !== id)
    return sendJSON(res, { message: "Deleted" })
  }

  // ── Static uploads (images) ───────────────────────────────────────────────
  if (method === "GET" && pathname.startsWith("/uploads/")) {
    res.writeHead(200, { "Content-Type": "image/png", "Access-Control-Allow-Origin": "*" })
    return res.end()
  }

  // 404
  sendJSON(res, { error: "Not found", path: pathname }, 404)
})

const PORT = 8080
server.listen(PORT, () => {
  console.log(`\n🍽️  Mock server Cuisenio démarré sur http://localhost:${PORT}`)
  console.log(`\nComptes disponibles:`)
  console.log(`  Admin : ${ADMIN_EMAIL}  /  ${ADMIN_PASSWORD}`)
  console.log(`  User  : ahmed@cuisenio.com  /  Ahmed@1234!`)
  console.log(`  (Tout nouveau register → rôle USER automatique)`)
  console.log(`\nEndpoints actifs:`)
  console.log(`  Auth, Profil, Recettes (${fakeRecipes.length}), Catégories (${fakeCategories.length}), Ingrédients (${fakeIngredients.length}), Utilisateurs (${fakeUsers.length}), Meal Planner\n`)
})
