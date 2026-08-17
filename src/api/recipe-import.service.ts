import axios from "axios"
import client from "./client"
import { routes } from "./routes"

export interface RecipeImportPreview {
  sourceUrl: string
  title: string
  description?: string | null
  prepTimeMinutes?: number | null
  cookTimeMinutes?: number | null
  ingredients: string[]
  steps: string[]
  imageUrl?: string | null
  parserUsed: string
}

export interface RecipeImportErrorBody {
  code?: string
  source?: string
  message?: string
  reason?: string
}

export function mapRecipeImportError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.code === "ECONNABORTED") {
      return "Le site met trop de temps à répondre. Réessayez dans quelques instants."
    }
    const status = err.response?.status
    const data = (err.response?.data ?? {}) as RecipeImportErrorBody
    if (status === 400) {
      return "Le lien fourni n'est pas valide."
    }
    switch (data.reason) {
      case "INVALID_URL":
        return "Le lien fourni n'est pas valide."
      case "UNSUPPORTED_DOMAIN":
        return "Ce site n'est pas encore pris en charge."
      case "ACCESS_BLOCKED":
        if (data.source === "TIKTOK") {
          return "Cette page TikTok ne peut pas être consultée automatiquement. Essayez avec un lien public."
        }
        if (data.source === "INSTAGRAM") {
          return "Cette page Instagram ne peut pas être consultée automatiquement. Essayez avec un lien public."
        }
        return "Cette page ne peut pas être consultée automatiquement."
      case "RECIPE_DATA_NOT_FOUND":
        return "Nous n'avons pas trouvé suffisamment d'informations pour créer la recette."
      case "TIMEOUT":
        return "Le site met trop de temps à répondre. Réessayez dans quelques instants."
      case "RATE_LIMITED":
        return "Le site limite temporairement l'accès. Réessayez plus tard."
      case "PAGE_UNAVAILABLE":
        return "Cette page est introuvable ou inaccessible."
      case "PARSER_FAILED":
        return "Nous n'avons pas pu analyser cette page."
      default:
        break
    }
    if (typeof data.message === "string" && data.message.trim() && !data.message.includes("AxiosError")) {
      return data.message
    }
  }
  return "L'import de la recette a échoué. Réessayez avec un autre lien."
}

export const recipeImportService = {
  async preview(url: string): Promise<RecipeImportPreview> {
    const { data } = await client.post<RecipeImportPreview>(
      routes.recipeImport.preview,
      { url },
      { timeout: 25_000 },
    )
    return data
  },
}
