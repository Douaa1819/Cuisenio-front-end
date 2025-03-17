import { useState, useCallback } from 'react';
import { CommentService } from '../api/comment.service';
import type { RecipeCommentResponse, RecipeCommentRequest } from '../types/recipe.types';

interface UseCommentsProps {
  recipeId?: number;
}

export function useComments({ recipeId }: UseCommentsProps = {}) {
  const [comments, setComments] = useState<RecipeCommentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async (id: number) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await CommentService.getCommentsByRecipeId(id);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (id: number, content: string) => {
    if (!id || !content.trim()) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const commentData: RecipeCommentRequest = { content };
      const response = await CommentService.createComment(id, commentData);
      
      setComments(prevComments => [...prevComments, response.data]);
      
      return response.data;
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useCallback(() => {
    if (recipeId) {
      fetchComments(recipeId);
    }
  }, [recipeId, fetchComments]);

  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment
  };
}
