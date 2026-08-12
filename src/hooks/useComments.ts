import { useCallback, useEffect, useState } from "react"
import { CommentService } from "../api/comment.service"
import type { RecipeCommentRequest, RecipeCommentResponse } from "../types/recipe.types"

interface UseCommentsProps {
  recipeId?: number
}

export function useComments({ recipeId }: UseCommentsProps = {}) {
  const [comments, setComments] = useState<RecipeCommentResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async (id: number) => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const response = await CommentService.getCommentsByRecipeId(id)
      setComments(response.data)
    } catch {
      setError("Impossible de charger les commentaires. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }, [])

  const addComment = useCallback(async (id: number, content: string): Promise<RecipeCommentResponse | null> => {
    const trimmed = content.trim()
    if (!id || !trimmed) return null
    setLoading(true)
    setError(null)
    try {
      const commentData: RecipeCommentRequest = { content: trimmed }
      const response = await CommentService.createComment(id, commentData)
      setComments((prev) => [...prev, response.data])
      return response.data
    } catch {
      setError("Impossible d'ajouter le commentaire. Veuillez réessayer.")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-fetch when recipeId is provided at mount time
  useEffect(() => {
    if (recipeId) {
      fetchComments(recipeId)
    }
  }, [recipeId, fetchComments])

  return { comments, loading, error, fetchComments, addComment }
}
