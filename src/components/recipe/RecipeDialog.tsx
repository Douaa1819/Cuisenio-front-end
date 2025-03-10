// "use client"

// import type React from "react"

// import { ChefHat, Clock, Heart, Bookmark, Share2 } from "lucide-react"
// import type { Recipe } from "../../types/recipe.types"
// import { Dialog } from "../ui/dialog"
// import { Button } from "../ui/button"
// import { Badge } from "../ui/badge"

// interface RecipeDialogProps {
//   recipe: Recipe
//   isOpen: boolean
//   onClose: () => void
//   onLike: (recipeId: number, event: React.MouseEvent) => void
//   onFavorite: (recipeId: number, event: React.MouseEvent) => void
//   onViewComments: (recipeId: number, event: React.MouseEvent) => void
//   onViewFullRecipe: () => void
//   formatDate: (dateString: string) => string
// }

// const RecipeDialog = ({
//   recipe,
//   isOpen,
//   onClose,
//   onLike,
//   onFavorite,
//   onViewFullRecipe,
//   formatDate,
// }: RecipeDialogProps) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose} className="max-w-[700px]">
//     <div className="mb-4">
//         <h2 className="text-xl font-bold">{recipe.title}</h2>
//         <p className="text-sm text-gray-500">
//           Publié par {recipe.user.name} • {formatDate(recipe.creationDate || new Date().toISOString())}
//         </p>
//       </div>

//       <div className="relative h-64 w-full overflow-hidden rounded-lg my-4">
//         <img
//           src={recipe.imageUrl || "/placeholder.svg?height=400&width=600"}
//           alt={recipe.title}
//           className="object-cover w-full h-full"
//         />
//       </div>

//       <div className="space-y-4">
//         <div className="flex flex-wrap gap-2">
//           {recipe.categories.map((category) => (
//             <Badge key={category} variant="default">
//               {category}
//             </Badge>
//           ))}
//         </div>

//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-1">
//               <Clock className="h-4 w-4 text-gray-500" />
//               <span className="text-sm text-gray-500">{recipe.preparationTime + recipe.cookingTime} min</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <ChefHat className="h-4 w-4 text-gray-500" />
//               <span className="text-sm text-gray-500">
//                 {recipe.difficultyLevel === "EASY"
//                   ? "Facile"
//                   : recipe.difficultyLevel === "MEDIUM"
//                     ? "Moyen"
//                     : "Difficile"}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               className={recipe.isLiked ? "text-rose-500" : ""}
//               onClick={(e) => onLike(recipe.id, e)}
//             >
//               <Heart className="h-4 w-4 mr-1" fill={recipe.isLiked ? "currentColor" : "none"} />
//               J'aime
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               className={recipe.isFavorite ? "text-amber-500" : ""}
//               onClick={(e) => onFavorite(recipe.id, e)}
//             >
//               <Bookmark className="h-4 w-4 mr-1" fill={recipe.isFavorite ? "currentColor" : "none"} />
//               Favoris
//             </Button>
//             <Button variant="outline" size="sm">
//               <Share2 className="h-4 w-4 mr-1" />
//               Partager
//             </Button>
//           </div>
//         </div>

//         <p className="text-gray-700">{recipe.description}</p>

//         <div className="pt-4">
//           <Button onClick={onViewFullRecipe} className="bg-rose-500 hover:bg-rose-600 text-white">
//             Voir la recette complète
//           </Button>
//         </div>
//       </div>
//     </Dialog>
//   )
// }

// export default RecipeDialog

