import client from "./client"
import type { RecipeCommentRequest, RecipeCommentResponse } from "../types/recipe.types"

export const CommentService = {
  createComment: (recipeId: number, data: RecipeCommentRequest) =>
    client.post<RecipeCommentResponse>(`/api/recipes/${recipeId}/comments`, data),

  getCommentsByRecipeId: (recipeId: number) =>
    client.get<RecipeCommentResponse[]>(`/api/recipes/${recipeId}/comments`),

  /** isApproved is serialized via URLSearchParams to guarantee safe encoding. */
  approveComment: (recipeId: number, commentId: number, isApproved: boolean) => {
    const params = new URLSearchParams({ isApproved: String(isApproved) })
    return client.patch<RecipeCommentResponse>(
      `/api/recipes/${recipeId}/comments/${commentId}/approve?${params.toString()}`,
    )
  },
}
