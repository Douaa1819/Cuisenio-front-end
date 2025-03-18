"use client"

import type React from "react"

import { Heart, MessageSquare, Bookmark, Clock } from "lucide-react"
import type { Recipe } from "../../types/recipe.types"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar } from "../ui/avatar"

interface RecipeCardProps {
  recipe: Recipe
  onViewRecipe: (recipe: Recipe) => void
  onLikeRecipe: (recipeId: number, event: React.MouseEvent) => void
  onFavoriteRecipe: (recipeId: number, event: React.MouseEvent) => void
  onViewComments: (recipeId: number, event: React.MouseEvent) => void
  formatDate: (dateString: string) => string
}

const RecipeCard = ({
  recipe,
  onViewRecipe,
  onLikeRecipe,
  onFavoriteRecipe,
  onViewComments,
}: RecipeCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
      onClick={() => onViewRecipe(recipe)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={recipe.imageUrl || "/placeholder.svg?height=400&width=600"}
          alt={recipe.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{recipe.title}</h3>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{recipe.preparationTime + recipe.cookingTime} min</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{recipe.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {recipe.categories.map((category) => (
            <Badge key={category} variant="default" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Avatar className="h-6 w-6">
            <img src={recipe.user.profilePicture || "/placeholder.svg"} alt={recipe.user.name} />
            <div className="bg-gray-200 h-full w-full flex items-center justify-center text-xs font-medium">
              {recipe.user.name.charAt(0)}
            </div>
          </Avatar>
          <span>{recipe.user.name}</span>
        </div>

        <div className="flex justify-between pt-3 border-t">
          <div className="flex items-center gap-4">
            <button
              className={`flex items-center gap-1 text-sm ${recipe.isLiked ? "text-rose-500" : "text-gray-500"}`}
              onClick={(e) => onLikeRecipe(recipe.id, e)}
            >
              <Heart className="h-4 w-4" fill={recipe.isLiked ? "currentColor" : "none"} />
              {recipe.likes}
            </button>
            <button
              className="flex items-center gap-1 text-sm text-gray-500"
              onClick={(e) => onViewComments(recipe.id, e)}
            >
              <MessageSquare className="h-4 w-4" />
              {recipe.comments}
            </button>
          </div>
          <button
            className={`${recipe.isFavorite ? "text-amber-500" : "text-gray-500"}`}
            onClick={(e) => onFavoriteRecipe(recipe.id, e)}
          >
            <Bookmark className="h-4 w-4" fill={recipe.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </Card>
  )
}

export default RecipeCard

