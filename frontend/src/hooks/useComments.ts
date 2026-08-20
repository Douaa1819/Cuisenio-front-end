import { useCallback, useEffect, useState } from "react"
import { CommentService } from "../api/comment.service"
import type { RecipeCommentRequest, RecipeCommentResponse } from "../types/recipe.types"

interface UseCommentsProps {
  recipePublicId?: string
}

export function useComments({ recipePublicId }: UseCommentsProps = {}) {
  const [comments, setComments] = useState<RecipeCommentResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async (id: string) => {
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

  const addComment = useCallback(async (id: string, content: string): Promise<RecipeCommentResponse | null> => {
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

  const updateComment = useCallback(async (id: string, commentId: number, content: string) => {
    const trimmed = content.trim()
    if (!id || !commentId || !trimmed) return null
    try {
      const response = await CommentService.updateComment(id, commentId, { content: trimmed })
      setComments((prev) => prev.map((c) => (c.id === commentId ? response.data : c)))
      return response.data
    } catch {
      setError("Impossible de modifier le commentaire.")
      return null
    }
  }, [])

  const deleteComment = useCallback(async (id: string, commentId: number) => {
    if (!id || !commentId) return false
    try {
      await CommentService.deleteComment(id, commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      return true
    } catch {
      setError("Impossible de supprimer le commentaire.")
      return false
    }
  }, [])

  useEffect(() => {
    if (recipePublicId) {
      fetchComments(recipePublicId)
    }
  }, [recipePublicId, fetchComments])

  return { comments, loading, error, fetchComments, addComment, updateComment, deleteComment }
}
