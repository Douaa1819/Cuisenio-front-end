"use client"

import type React from "react"

import { Heart, MessageSquare, Bookmark, Clock } from "lucide-react"
import type { Recipe } from "../../types/recipe.types"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar } from "../ui/avatar"
import { Button } from "../ui/button"
import { resolveRecipeImage } from "../../lib/recipe-covers"

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
  const cover = resolveRecipeImage(recipe.imageUrl, recipe.categories?.[0])

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border bg-card text-card-foreground shadow-card-theme transition-transform duration-200 ease-out hover:-translate-y-0.5 rounded-recipe"
      onClick={() => onViewRecipe(recipe)}
    >
      <div className="relative h-48 w-full overflow-hidden bg-muted/40">
        <img
          src={cover.src}
          srcSet={cover.srcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={recipe.title}
          width={600}
          height={400}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.srcset = ""
            event.currentTarget.src = resolveRecipeImage(null, recipe.categories?.[0]).src
          }}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="recipe-title-overlay absolute inset-x-0 bottom-0 flex items-end p-3 pt-12">
          <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-white drop-shadow sm:text-lg">
            {recipe.title}
          </h3>
        </div>
      </div>
      <div className="space-y-3.5 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{recipe.description}</p>
          <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground sm:text-sm">
            <Clock className="h-4 w-4" />
            <span>{recipe.preparationTime + recipe.cookingTime} min</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {recipe.categories.map((category) => (
            <Badge key={category} variant="category" size="sm" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6 border border-border">
            <img src={recipe.user.profilePicture || cover.src} alt={recipe.user.name} />
            <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium">
              {recipe.user.name.charAt(0)}
            </div>
          </Avatar>
          <span>{recipe.user.name}</span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`h-9 min-w-9 px-2 text-sm transition-colors ${recipe.isLiked ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              onClick={(e) => onLikeRecipe(recipe.id, e)}
              aria-label="Like recipe"
              aria-pressed={recipe.isLiked}
            >
              <Heart className="h-4 w-4" fill={recipe.isLiked ? "currentColor" : "none"} />
              {recipe.likes}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 min-w-9 px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={(e) => onViewComments(recipe.id, e)}
              aria-label="View comments"
            >
              <MessageSquare className="h-4 w-4" />
              {recipe.comments}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`h-9 min-w-9 px-2 transition-colors ${recipe.isFavorite ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            onClick={(e) => onFavoriteRecipe(recipe.id, e)}
            aria-label="Save recipe"
            aria-pressed={recipe.isFavorite}
          >
            <Bookmark className="h-4 w-4" fill={recipe.isFavorite ? "currentColor" : "none"} />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default RecipeCard
