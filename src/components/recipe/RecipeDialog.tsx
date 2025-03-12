"use client"

import React from "react"
import { ChefHat, Clock, Heart, Bookmark, Share2 } from "lucide-react"
import type { Recipe } from "../../types/recipe.types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar } from "../ui/avatar"

interface RecipeDialogProps {
  recipe: Recipe
  isOpen: boolean
  onClose: () => void
  onLike: (recipeId: number, event: React.MouseEvent) => void
  onFavorite: (recipeId: number, event: React.MouseEvent) => void
  onViewComments: (recipeId: number, event: React.MouseEvent) => void
  onViewFullRecipe: () => void
  formatDate: (dateString: string) => string
}

const RecipeDialog = ({
  recipe,
  isOpen,
  onClose,
  onLike,
  onFavorite,
  onViewFullRecipe,
  formatDate,
}: RecipeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle><span className="text-xl font-semibold">{recipe.title}</span></DialogTitle>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
            <Avatar className="h-8 w-8">
              <span className="font-medium">{recipe.user.name.charAt(0)}</span>
            </Avatar>
            <span>Publié par {recipe.user.name} • {formatDate(recipe.creationDate || new Date().toISOString())}</span>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <img 
            src={recipe.imageUrl || "/api/placeholder/600/400"} 
            alt={recipe.title} 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {recipe.categories.map((category) => (
            <Badge key={category} variant="default" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-sm">
              {recipe.preparationTime + recipe.cookingTime} min
            </span>
          </div>
          <div className="flex items-center">
            <ChefHat className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-sm">
              {recipe.difficultyLevel === "EASY"
                ? "Facile"
                : recipe.difficultyLevel === "MEDIUM"
                  ? "Moyen"
                  : "Difficile"}
            </span>
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={(e) => onLike(recipe.id, e)}
          >
            <Heart className="h-4 w-4 mr-2" />
            J'aime
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={(e) => onFavorite(recipe.id, e)}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Favoris
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>

        <div className="mt-4 text-gray-700 prose">
          {recipe.description}
        </div>

        <div className="mt-6">
          <Button 
            className="w-full bg-rose-500 hover:bg-rose-600 text-white" 
            onClick={onViewFullRecipe}
          >
            Voir la recette complète
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RecipeDialog