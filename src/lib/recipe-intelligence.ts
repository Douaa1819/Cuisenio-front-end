import type { RecipeResponse } from "../types/recipe.types"

/** Client-side culinary intelligence — no external AI API required. */

const SUBSTITUTIONS: Record<string, string[]> = {
  beurre: ["huile d'olive", "margarine", "huile de coco"],
  lait: ["lait d'amande", "lait d'avoine", "lait de soja"],
  oeufs: ["compote de pommes", "graines de lin + eau", "aquafaba"],
  farine: ["farine de riz", "farine d'épeautre", "farine sans gluten"],
  sucre: ["miel", "sirop d'érable", "érythritol"],
  crème: ["yaourt grec", "lait de coco épais"],
  poulet: ["tofu ferme", "pois chiches", "dinde"],
  parmesan: ["levure nutritionnelle", "pecorino"],
}

export function suggestSubstitutions(ingredientName: string): string[] {
  const key = ingredientName
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
  for (const [needle, alts] of Object.entries(SUBSTITUTIONS)) {
    if (key.includes(needle)) return alts
  }
  return []
}

export interface NutritionEstimate {
  calories: number
  protein: number
  carbs: number
  fat: number
  confidence: "low" | "medium"
}

/** Rough per-serving heuristic for portfolio demo — not medical-grade. */
export function estimateNutrition(recipe: RecipeResponse): NutritionEstimate {
  const base =
    180 +
    (recipe.recipeIngredients?.length ?? 0) * 35 +
    (recipe.cookingTime ?? 0) * 1.2 +
    (recipe.preparationTime ?? 0) * 0.4
  const servings = Math.max(1, recipe.servings || 1)
  const calories = Math.round(base / Math.sqrt(servings) * 1.8)
  return {
    calories,
    protein: Math.round(calories * 0.18 / 4),
    carbs: Math.round(calories * 0.48 / 4),
    fat: Math.round(calories * 0.34 / 9),
    confidence: "low",
  }
}

export function estimateCostEur(recipe: RecipeResponse): number {
  const perIngredient = 0.85
  const timeFactor = ((recipe.preparationTime ?? 0) + (recipe.cookingTime ?? 0)) / 60
  const raw = (recipe.recipeIngredients?.length ?? 3) * perIngredient + timeFactor * 1.5
  return Math.round(raw * 10) / 10
}

export function totalMinutes(recipe: Pick<RecipeResponse, "preparationTime" | "cookingTime">) {
  return (recipe.preparationTime ?? 0) + (recipe.cookingTime ?? 0)
}

export function isQuick(recipe: RecipeResponse, max = 20) {
  return totalMinutes(recipe) <= max
}

export function isEasy(recipe: RecipeResponse) {
  const d = String(recipe.difficultyLevel)
  return d === "EASY" || d === "DifficultyLevel.EASY"
}

/** Score recipes for "for you" based on recently viewed category affinity. */
export function rankForYou(
  recipes: RecipeResponse[],
  recentIds: number[],
  preferredCategoryNames: string[],
): RecipeResponse[] {
  const recentSet = new Set(recentIds)
  return [...recipes]
    .map((r) => {
      let score = (r.averageRating ?? 0) * 10 + (r.totalRatings ?? 0)
      if (recentSet.has(r.id)) score -= 50
      const cats = r.categories?.map((c) => c.name.toLowerCase()) ?? []
      for (const pref of preferredCategoryNames) {
        if (cats.some((c) => c.includes(pref.toLowerCase()))) score += 25
      }
      if (isQuick(r)) score += 8
      return { r, score }
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.r)
}

export function getSeasonLabel(date = new Date()): { key: string; label: string } {
  const m = date.getMonth()
  if (m >= 2 && m <= 4) return { key: "spring", label: "Printemps" }
  if (m >= 5 && m <= 7) return { key: "summer", label: "Été" }
  if (m >= 8 && m <= 10) return { key: "autumn", label: "Automne" }
  return { key: "winter", label: "Hiver" }
}

const SEASON_KEYWORDS: Record<string, string[]> = {
  spring: ["salade", "légume", "frais", "citron", "herbes"],
  summer: ["salade", "grill", "froid", "fruit", "méditerran"],
  autumn: ["soupe", "mijot", "potiron", "champignon", "lentille"],
  winter: ["soupe", "tajine", "réconfort", "chocolat", "four"],
}

export function seasonalRecipes(recipes: RecipeResponse[]): RecipeResponse[] {
  const { key } = getSeasonLabel()
  const words = SEASON_KEYWORDS[key] ?? []
  return recipes.filter((r) => {
    const hay = `${r.title} ${r.description}`.toLowerCase()
    return words.some((w) => hay.includes(w))
  })
}

export function topChefs(recipes: RecipeResponse[]) {
  const map = new Map<number, { user: RecipeResponse["user"]; count: number; ratingSum: number }>()
  for (const r of recipes) {
    if (!r.user?.id) continue
    const cur = map.get(r.user.id) ?? { user: r.user, count: 0, ratingSum: 0 }
    cur.count += 1
    cur.ratingSum += r.averageRating ?? 0
    map.set(r.user.id, cur)
  }
  return [...map.values()]
    .map((c) => ({
      ...c,
      avgRating: c.count ? c.ratingSum / c.count : 0,
    }))
    .sort((a, b) => b.count - a.count || b.avgRating - a.avgRating)
    .slice(0, 6)
}
