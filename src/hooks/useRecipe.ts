"use client"

import { useState, useEffect, useCallback } from "react"
import { recipeService } from "../api/recipe.service"
import type { RecipeResponse } from "../types/recipe.types"
import type { RecipeDetailsRequest } from "../types/recipe.types"

interface UseRecipeProps {
  initialPage?: number
  pageSize?: number
  sortBy?: string
}

export const useRecipe = ({ initialPage = 0, pageSize = 10, sortBy = "creationDate" }: UseRecipeProps = {}) => {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState<number>(initialPage)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalElements, setTotalElements] = useState<number>(0)

  const fetchRecipes = useCallback(
    async (pageNumber = page) => {
      setLoading(true)
      try {
        const response = await recipeService.getAllRecipes(pageNumber, pageSize, sortBy)
        setRecipes(response.content)
        setTotalPages(response.totalPages)
        setTotalElements(response.totalElements)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    },
    [page, pageSize, sortBy],
  )

  const fetchRecipeById = async (id: number) => {
    setLoading(true)
    try {
      const recipe = await recipeService.getRecipeById(id)
      return recipe
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      return null
    } finally {
      setLoading(false)
    }
  }

  const createRecipe = async (recipeData: FormData, detailsData: RecipeDetailsRequest) => {
    setLoading(true)
    try {
      const newRecipe = await recipeService.createRecipe(recipeData, detailsData)
      // Refresh recipes after creating a new one
      fetchRecipes()
      return newRecipe
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      return null
    } finally {
      setLoading(false)
    }
  }

  const searchRecipes = async (
    query?: string,
    difficultyLevel?: string,
    maxPrepTime?: number,
    maxCookTime?: number,
    categoryType?: string,
    isApproved?: boolean,
    pageNumber = page,
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
        pageNumber,
        pageSize,
        sortBy,
      )
      setRecipes(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    } finally {
      setLoading(false)
    }
  }

  const getMyRecipes = async (pageNumber = page) => {
    setLoading(true)
    try {
      const response = await recipeService.getMyRecipes(pageNumber, pageSize, sortBy)
      setRecipes(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    } finally {
      setLoading(false)
    }
  }

  const nextPage = () => {
    if (page < totalPages - 1) {
      const nextPageNumber = page + 1
      setPage(nextPageNumber)
      fetchRecipes(nextPageNumber)
    }
  }

  const prevPage = () => {
    if (page > 0) {
      const prevPageNumber = page - 1
      setPage(prevPageNumber)
      fetchRecipes(prevPageNumber)
    }
  }

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setPage(pageNumber)
      fetchRecipes(pageNumber)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  return {
    recipes,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    fetchRecipes,
    fetchRecipeById,
    createRecipe,
    searchRecipes,
    getMyRecipes,
    nextPage,
    prevPage,
    goToPage,
  }
}

