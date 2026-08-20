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

  getRecipeByPublicId: async (publicId: string): Promise<RecipeResponse> => {
    return apiClient.get<RecipeResponse>(routes.recipes.detail(publicId))
  },

  toggleLike: async (publicId: string): Promise<{ likesCount: number; likedByCurrentUser: boolean }> => {
    return apiClient.post<{ likesCount: number; likedByCurrentUser: boolean }>(routes.recipes.likes(publicId))
  },

  getLikes: async (publicId: string): Promise<{ likesCount: number; likedByCurrentUser: boolean }> => {
    return apiClient.get<{ likesCount: number; likedByCurrentUser: boolean }>(routes.recipes.likes(publicId))
  },

  createRecipe: async (recipeFormData: RecipeFormData): Promise<RecipeResponse> => {
    return apiClient.post<RecipeResponse, RecipeFormData>(routes.recipes.base, recipeFormData)
  },

  addImageToRecipe: async (publicId: string, formData: FormData): Promise<RecipeResponse> => {
    return apiClient.post<RecipeResponse, FormData>(routes.recipes.addImage(publicId), formData)
  },

  updateRecipe: async (publicId: string, recipeData: RecipeFormData): Promise<RecipeResponse> => {
    return apiClient.put<RecipeResponse, RecipeFormData>(routes.recipes.detail(publicId), recipeData)
  },

  deleteRecipe: async (publicId: string): Promise<void> => {
    await apiClient.delete<void>(routes.recipes.detail(publicId))
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

  saveRecipe: async (publicId: string): Promise<void> => {
    await apiClient.post<void>(`${routes.recipes.base}/${publicId}/save`)
  },

  unsaveRecipe: async (publicId: string): Promise<void> => {
    await apiClient.delete<void>(routes.recipes.unsave(publicId))
  },

  rateRecipe: async (publicId: string, rating: number): Promise<void> => {
    await apiClient.post<void, { score: number }>(`${routes.recipes.base}/${publicId}/ratings`, { score: rating })
  },

  submitForReview: async (publicId: string): Promise<RecipeResponse> => {
    return apiClient.patch<RecipeResponse>(routes.recipes.submitForReview(publicId))
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

  reportRecipe: async (publicId: string, reason: string): Promise<{ recipeId: number; reportCount: number }> => {
    return apiClient.post<{ recipeId: number; reportCount: number }, { reason: string }>(routes.recipes.report(publicId), {
      reason,
    })
  },

  reportComment: async (
    recipePublicId: string,
    commentId: number,
    reason: string,
  ): Promise<{ recipeId: number; commentId: number; reportCount: number }> => {
    return apiClient.post<{ recipeId: number; commentId: number; reportCount: number }, { reason: string }>(
      routes.recipes.reportComment(recipePublicId, commentId),
      { reason },
    )
  },

  getModerationReports: async (): Promise<ModerationReportItem[]> => {
    return apiClient.get<ModerationReportItem[]>(routes.recipes.moderationReports)
  },

  updatePromotionSettings: async (
    recipeId: number,
    payload: { isFeatured?: boolean; kitchenTools?: Array<{ name: string; affiliateUrl?: string }> },
  ): Promise<RecipeResponse> => {
    return apiClient.patch<
      RecipeResponse,
      { isFeatured?: boolean; kitchenTools?: Array<{ name: string; affiliateUrl?: string }> }
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
