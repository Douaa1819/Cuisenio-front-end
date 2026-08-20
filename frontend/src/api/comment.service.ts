import client from "./client"
import type { RecipeCommentRequest, RecipeCommentResponse } from "../types/recipe.types"

export const CommentService = {
  createComment: (recipePublicId: string, data: RecipeCommentRequest) =>
    client.post<RecipeCommentResponse>(`/api/recipes/${recipePublicId}/comments`, data),

  getCommentsByRecipeId: (recipePublicId: string) =>
    client.get<RecipeCommentResponse[]>(`/api/recipes/${recipePublicId}/comments`),

  updateComment: (recipePublicId: string, commentId: number, data: RecipeCommentRequest) =>
    client.put<RecipeCommentResponse>(`/api/recipes/${recipePublicId}/comments/${commentId}`, data),

  deleteComment: (recipePublicId: string, commentId: number) =>
    client.delete<void>(`/api/recipes/${recipePublicId}/comments/${commentId}`),

  approveComment: (recipePublicId: string, commentId: number, isApproved: boolean) => {
    const params = new URLSearchParams({ isApproved: String(isApproved) })
    return client.patch<RecipeCommentResponse>(
      `/api/recipes/${recipePublicId}/comments/${commentId}/approve?${params.toString()}`,
    )
  },
}
