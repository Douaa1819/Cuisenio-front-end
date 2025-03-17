import { RecipeFormData } from './../pages/community/validation/recipe-validation';

import { useState, useCallback } from "react"
import { recipeService } from "../api/recipe.service"
import type { RecipeResponse } from "../types/recipe.types"

interface UseRecipeOptions {
  pageSize?: number
}

// Change the export to be a named export instead of default
export const useRecipe = (options: UseRecipeOptions = {}) => {
  const { pageSize = 10 } = options

  const [recipes, setRecipes] = useState<RecipeResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Fetch recipes
  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    try {
      const response = await recipeService.getAllRecipes()
      setRecipes(response.content || [])
      setTotalPages(response.totalPages || 0)
      setError(null)
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  // Search recipes
  const searchRecipes = useCallback(
    async (
      query?: string,
      difficultyLevel?: string,
      maxPrepTime?: number,
      maxCookTime?: number,
      categoryType?: string,
      isApproved?: boolean,
    ) => {
      setLoading(true)
      try {
        const response = await recipeService.searchRecipes(
          query,
          difficultyLevel,
          maxPrepTime,
          maxCookTime,
          categoryType,
          isApproved,
          page,
          pageSize,
        )
        setRecipes(response.content || [])
        setTotalPages(response.totalPages || 0)
        setError(null)
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    },
    [page, pageSize],
  )

  // Create recipe
  const createRecipe = async (recipeFormData: RecipeFormData) => {
    setLoading(true)
    try {
      const response = await recipeService.createRecipe(recipeFormData)
        
      setLoading(false)
      return response
    } catch (error) {

      setError(error as Error)
      setLoading(false)
      throw error
    }
  }

  const addImageToRecipe = async (id: number,formData: FormData) => {
    setLoading(true)
    try {
      const response = await recipeService.addImageToRecipe(id,formData)
      setLoading(false)
      return response
    } catch (error) {

      setError(error as Error)
      setLoading(false)
      throw error
    }
  }

  // Pagination
  const nextPage = useCallback(() => {
    if (page < totalPages - 1) {
      setPage(page + 1)
    }
  }, [page, totalPages])

  const prevPage = useCallback(() => {
    if (page > 0) {
      setPage(page - 1)
    }
  }, [page])

  return {
    recipes,
    loading,
    error,
    page,
    totalPages,
    fetchRecipes,
    searchRecipes,
    createRecipe,
    nextPage,
    prevPage,
    addImageToRecipe,
  }
}

