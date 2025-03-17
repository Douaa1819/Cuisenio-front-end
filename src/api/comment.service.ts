import client from './client';
import type { RecipeCommentResponse, RecipeCommentRequest } from '../types/recipe.types';

export const CommentService = {
  createComment: (recipeId: number, data: RecipeCommentRequest) => 
    client.post<RecipeCommentResponse>(`api/recipes/${recipeId}/comments`, data),
  
  getCommentsByRecipeId: (recipeId: number) =>
    client.get<RecipeCommentResponse[]>(`api/recipes/${recipeId}/comments`),
  
  approveComment: (recipeId: number, commentId: number, isApproved: boolean) =>
    client.patch<RecipeCommentResponse>(`api/recipes/${recipeId}/comments/${commentId}/approve?isApproved=${isApproved}`)
};
