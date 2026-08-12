import type { RecipeFormData } from "../pages/community/validation/recipe-validation"
import type { ModerationReportItem, PageResponse, RecipeResponse, RecipeWorkflowStatus } from "../types/recipe.types"
import { routes } from "./routes"
import { apiClient } from "./unified-client"

export const recipeService = {
  getAllRecipes: async (): Promise<PageResponse<RecipeResponse>> => {
    return apiClient.get<PageResponse<RecipeResponse>>(routes.recipes.base)
  },

  getHomepageHeroRecipes: async (): Promise<RecipeResponse[]> => {
    return apiClient.get<RecipeResponse[]>(routes.recipes.homepageHero)
  },

  getRecipeById: async (id: number): Promise<RecipeResponse> => {
    return apiClient.get<RecipeResponse>(routes.recipes.detail(id))
  },

  createRecipe: async (recipeFormData: RecipeFormData): Promise<RecipeResponse> => {
    return apiClient.post<RecipeResponse, RecipeFormData>(routes.recipes.base, recipeFormData)
  },

  addImageToRecipe: async (id: number, formData: FormData): Promise<RecipeResponse> => {
    return apiClient.post<RecipeResponse, FormData>(routes.recipes.addImage(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  updateRecipe: async (id: number, recipeData: FormData): Promise<RecipeResponse> => {
    return apiClient.put<RecipeResponse, FormData>(routes.recipes.detail(id), recipeData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  deleteRecipe: async (id: number): Promise<void> => {
    await apiClient.delete<void>(routes.recipes.detail(id))
  },

  searchRecipes: async (
    query?: string,
    difficultyLevel?: string,
    maxPrepTime?: number,
    maxCookTime?: number,
    categoryType?: string,
    isApproved?: boolean,
    page = 0,
    size = 10,
    sort = "creationDate",
  ): Promise<PageResponse<RecipeResponse>> => {
    const params = new URLSearchParams()

    if (query?.trim()) params.append("query", query.trim())
    if (difficultyLevel) params.append("difficultyLevel", difficultyLevel)
    if (maxPrepTime !== undefined) params.append("maxPrepTime", String(maxPrepTime))
    if (maxCookTime !== undefined) params.append("maxCookTime", String(maxCookTime))
    if (categoryType) params.append("categoryType", categoryType)
    if (isApproved !== undefined) params.append("isApproved", String(isApproved))

    params.append("page", String(Math.max(0, page)))
    params.append("size", String(Math.min(50, Math.max(1, size))))
    params.append("sort", sort)

    return apiClient.get<PageResponse<RecipeResponse>>(`${routes.recipes.search}?${params.toString()}`)
  },

  getMyRecipes: async (page = 0, size = 10): Promise<PageResponse<RecipeResponse>> => {
    const params = new URLSearchParams({
      page: String(Math.max(0, page)),
      size: String(Math.min(50, Math.max(1, size))),
    })
    return apiClient.get<PageResponse<RecipeResponse>>(`${routes.recipes.base}/my-recipes?${params.toString()}`)
  },

  getSavedRecipes: async (page = 0, size = 10): Promise<PageResponse<RecipeResponse>> => {
    const params = new URLSearchParams({
      page: String(Math.max(0, page)),
      size: String(Math.min(50, Math.max(1, size))),
    })
    return apiClient.get<PageResponse<RecipeResponse>>(`${routes.recipes.saved}?${params.toString()}`)
  },

  saveRecipe: async (recipeId: number): Promise<void> => {
    await apiClient.post<void>(`${routes.recipes.base}/${recipeId}/save`)
  },

  unsaveRecipe: async (recipeId: number): Promise<void> => {
    await apiClient.delete<void>(routes.recipes.unsave(recipeId))
  },

  rateRecipe: async (recipeId: number, rating: number): Promise<void> => {
    await apiClient.post<void, { rating: number }>(`${routes.recipes.base}/${recipeId}/rate`, { rating })
  },

  submitForReview: async (recipeId: number): Promise<RecipeResponse> => {
    return apiClient.patch<RecipeResponse>(routes.recipes.submitForReview(recipeId))
  },

  approveRecipe: async (recipeId: number): Promise<RecipeResponse> => {
    return apiClient.patch<RecipeResponse>(routes.recipes.approve(recipeId))
  },

  getModerationQueue: async (): Promise<PageResponse<RecipeResponse>> => {
    return apiClient.get<PageResponse<RecipeResponse>>(routes.recipes.moderationQueue)
  },

  updateModerationStatus: async (
    recipeId: number,
    status: Extract<RecipeWorkflowStatus, "published" | "rejected">,
  ): Promise<RecipeResponse> => {
    return apiClient.patch<RecipeResponse, { status: "published" | "rejected" }>(
      routes.recipes.moderationStatus(recipeId),
      { status },
    )
  },

  reportRecipe: async (recipeId: number, reason: string): Promise<{ recipeId: number; reportCount: number }> => {
    return apiClient.post<{ recipeId: number; reportCount: number }, { reason: string }>(routes.recipes.report(recipeId), {
      reason,
    })
  },

  reportComment: async (
    recipeId: number,
    commentId: number,
    reason: string,
  ): Promise<{ recipeId: number; commentId: number; reportCount: number }> => {
    return apiClient.post<{ recipeId: number; commentId: number; reportCount: number }, { reason: string }>(
      routes.recipes.reportComment(recipeId, commentId),
      { reason },
    )
  },

  getModerationReports: async (): Promise<ModerationReportItem[]> => {
    return apiClient.get<ModerationReportItem[]>(routes.recipes.moderationReports)
  },

  updatePromotionSettings: async (
    recipeId: number,
    payload: { isFeatured?: boolean; isPremium?: boolean; kitchenTools?: Array<{ name: string; affiliateUrl?: string }> },
  ): Promise<RecipeResponse> => {
    return apiClient.patch<
      RecipeResponse,
      { isFeatured?: boolean; isPremium?: boolean; kitchenTools?: Array<{ name: string; affiliateUrl?: string }> }
    >(
      routes.recipes.promotion(recipeId),
      payload,
    )
  },

  /** Admin: restore a soft-deleted (archived) recipe */
  restoreRecipe: async (id: number): Promise<RecipeResponse> => {
    return apiClient.put<RecipeResponse>(routes.recipes.restore(id))
  },
}
