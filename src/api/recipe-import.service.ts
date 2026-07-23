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

export const recipeImportService = {
  async preview(url: string): Promise<RecipeImportPreview> {
    const { data } = await client.post<RecipeImportPreview>(routes.recipeImport.preview, { url })
    return data
  },
}
