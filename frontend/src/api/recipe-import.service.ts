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

export function mapRecipeImportError(err: unknown): { title: string; message: string } {
  const failed = (message: string, title = "Import impossible") => ({ title, message })

  if (axios.isAxiosError(err)) {
    if (err.code === "ECONNABORTED") {
      return failed("Le site met trop de temps à répondre. Réessayez dans quelques instants.")
    }
    const status = err.response?.status
    const data = (err.response?.data ?? {}) as RecipeImportErrorBody
    if (status === 400 || data.reason === "INVALID_URL") {
      return failed("Le lien fourni n'est pas une adresse valide.", "URL invalide")
    }
    switch (data.reason) {
      case "UNSUPPORTED_DOMAIN":
        return failed("Ce site n'est pas encore pris en charge.")
      case "ACCESS_BLOCKED":
        if (data.source === "TIKTOK") {
          return failed("Cette page TikTok ne peut pas être consultée automatiquement. Essayez avec un lien public.")
        }
        if (data.source === "INSTAGRAM") {
          return failed("Cette page Instagram ne peut pas être consultée automatiquement. Essayez avec un lien public.")
        }
        return failed("Cette page ne peut pas être consultée automatiquement.")
      case "RECIPE_DATA_NOT_FOUND":
      case "PARSER_FAILED":
        return failed("Nous n'avons pas pu extraire cette recette depuis cette page.")
      case "TIMEOUT":
        return failed("Le site met trop de temps à répondre. Réessayez dans quelques instants.")
      case "RATE_LIMITED":
        return failed("Le site limite temporairement l'accès. Réessayez plus tard.")
      case "PAGE_UNAVAILABLE":
        return failed("Cette page est introuvable ou inaccessible.")
      default:
        break
    }
  }
  return failed("Nous n'avons pas pu extraire cette recette depuis cette page.")
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
