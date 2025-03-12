// "use client"

// import React, { useState, useEffect } from "react"
// import { Search, Filter, Clock, Plus } from 'lucide-react';
// import type { Recipe } from "../../types/recipe.types"
// import type { Comment } from "../../types/recipe.types"
// import { Button } from "../../components/ui/button"
// import { Input } from "../../components/ui/input"

// import { useRecipes } from "../../hooks/useRecipe"
// import { Avatar } from "../../components/ui/avatar"
// import { Badge } from "../../components/ui/badge"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs"
// import RecipeCard from "../../components/recipe/RecipeCard"
// import RecipeDialog from "../../components/recipe/RecipeDialog"
// import CommentDialog from "../../components/recipe/CommentDialog"

// const CommunityPage: React.FC = () => {
//   const { 
//     recipes, 
//     filteredRecipes, 
//     searchQuery, 
//     setSearchQuery,
//     selectedCategory,
//     setSelectedCategory,
//     categories,
//     loading,
//     error,
//     likeRecipe,
//     favoriteRecipe,
//     fetchRecipes 
//   } = useRecipes()
  
//   // Define trendingRecipes since it's missing from your recipe context
//   const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([])
  
//   // For selected recipe and comments
//   const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
//   const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false)
//   const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
//   const [comments, setComments] = useState<Comment[]>([])
//   const [newComment, setNewComment] = useState("")
//   const [activeTab, setActiveTab] = useState("all")

//   useEffect(() => {
//     fetchRecipes()
//     // Define trending recipes as the top 5 most liked recipes
//     if (recipes.length > 0) {
//       const sorted = [...recipes].sort((a, b) => b.likesCount - a.likesCount)
//       setTrendingRecipes(sorted.slice(0, 5))
//     }
//   }, [fetchRecipes, recipes])

//   const handleViewRecipe = (recipe: Recipe) => {
//     setSelectedRecipe(recipe)
//     setIsRecipeDialogOpen(true)
//   }

//   const handleLikeRecipe = (recipeId: number, event: React.MouseEvent) => {
//     event.stopPropagation()
//     likeRecipe(recipeId)
//   }

//   const handleFavoriteRecipe = (recipeId: number, event: React.MouseEvent) => {
//     event.stopPropagation()
//     favoriteRecipe(recipeId)
//   }

//   const handleViewComments = (recipeId: number, event: React.MouseEvent) => {
//     event.stopPropagation()
//     const recipe = recipes.find(r => r.id === recipeId)
//     if (recipe) {
//       setSelectedRecipe(recipe)
//       // In a real app, you would fetch comments here
//       setComments([
//         // Example comments - replace with actual API call
//         {
//           id: 1,
//           user: { id: 1, name: "User1" },
//           content: "Délicieuse recette !",
//           creationDate: new Date().toISOString(),
//           recipe: { id: recipeId }
//         },
//         {
//           id: 2,
//           user: { id: 2, name: "User2" },
//           content: "J'ai adoré. Merci pour le partage !",
//           creationDate: new Date().toISOString(),
//           recipe: { id: recipeId }
//         }
//       ])
//       setIsCommentDialogOpen(true)
//     }
//   }

//   const handleViewProfile = () => {
//     // Navigate to profile or open profile dialog
//     console.log("Viewing profile")
//   }

//   const handleAddComment = () => {
//     if (newComment.trim() && selectedRecipe) {
//       const newCommentObj = {
//         id: comments.length + 1,
//         user: { id: user?.id || 0, name: user?.name || "Anonymous" },
//         content: newComment,
//         creationDate: new Date().toISOString(),
//         recipe: { id: selectedRecipe.id }
//       }
//       setComments([...comments, newCommentObj])
//       setNewComment("")
//     }
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return new Intl.DateTimeFormat('fr-FR', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     }).format(date)
//   }

//   const handleTabChange = (value: string) => {
//     setActiveTab(value)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
//       {/* Header section */}
//       <div className="bg-white dark:bg-gray-800 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Communauté Cuisenio</h1>
            
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <Input
//                   type="text"
//                   placeholder="Rechercher une recette..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 pr-4 py-2 w-64 rounded-lg"
//                 />
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               </div>
              
//               <Button 
//                 variant="outline" 
//                 // Change from "icon" to valid size
//                 size="sm" 
//                 className="flex items-center gap-2"
//               >
//                 <span>Filtres</span>
//                 <ChevronDown className="h-4 w-4" />
//               </Button>
              
//               <Button 
//                 variant="outline" 
//                 // Change from "icon" to valid size
//                 size="sm" 
//                 className="flex items-center gap-2"
//               >
//                 <span>Trier par</span>
//                 <ChevronDown className="h-4 w-4" />
//               </Button>
              
//               {/* Fix Avatar by adding a wrapper div with onClick instead */}
//               <div onClick={handleViewProfile} className="cursor-pointer">
//                 <Avatar className="h-8 w-8">
//                   <User className="h-4 w-4" />
//                 </Avatar>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Main content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
//             Découvrez les recettes de la communauté
//           </h2>
          
//           {/* Categories */}
//           <div className="flex flex-wrap gap-2 mb-6">
//             <Badge 
//               variant={selectedCategory === null ? "default" : "outline"}
//               className="cursor-pointer"
//               onClick={() => setSelectedCategory(null)}
//             >
//               Toutes
//             </Badge>
            
//             {categories.map((category) => (
//               <Badge
//                 key={category}
//                 variant={selectedCategory === category ? "default" : "outline"}
//                 className="cursor-pointer"
//                 onClick={() => setSelectedCategory(category)}
//               >
//                 {category}
//               </Badge>
//             ))}
//           </div>
          
//           {/* Tabs with proper onValueChange type */}
//           <Tabs 
//             defaultValue="all" 
//             value={activeTab}
//             className="mt-6"
//             onValueChange={(value: string) => handleTabChange(value)}
//           >
//             <TabsList className="mb-4">
//               <TabsTrigger value="all">Toutes les recettes</TabsTrigger>
//               <TabsTrigger value="trending">Tendances</TabsTrigger>
//               <TabsTrigger value="recent">Récentes</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="all">
//               {loading ? (
//                 <div className="text-center py-10">Chargement des recettes...</div>
//               ) : error ? (
//                 <div className="text-center py-10 text-red-500">Erreur lors du chargement des recettes.</div>
//               ) : filteredRecipes.length === 0 ? (
//                 <div className="text-center py-10">Aucune recette trouvée.</div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredRecipes.map((recipe) => (
//                     <RecipeCard
//                       key={recipe.id}
//                       recipe={recipe}
//                       onViewRecipe={handleViewRecipe}
//                       onLikeRecipe={handleLikeRecipe}
//                       onFavoriteRecipe={handleFavoriteRecipe}
//                       onViewComments={handleViewComments}
//                       formatDate={formatDate}
//                       theme={theme} // Add theme prop
//                     />
//                   ))}
//                 </div>
//               )}
//             </TabsContent>
            
//             <TabsContent value="trending">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {trendingRecipes.map((recipe: Recipe) => (
//                   <RecipeCard
//                     key={recipe.id}
//                     recipe={recipe}
//                     onViewRecipe={handleViewRecipe}
//                     onLikeRecipe={handleLikeRecipe}
//                     onFavoriteRecipe={handleFavoriteRecipe}
//                     onViewComments={handleViewComments}
//                     formatDate={formatDate}
//                     theme={theme} // Add theme prop
//                   />
//                 ))}
//               </div>
//             </TabsContent>
            
//             <TabsContent value="recent">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {[...recipes]
//                   .sort((a, b) => new Date(b.creationDate || "").getTime() - new Date(a.creationDate || "").getTime())
//                   .slice(0, 6)
//                   .map((recipe) => (
//                     <RecipeCard
//                       key={recipe.id}
//                       recipe={recipe}
//                       onViewRecipe={handleViewRecipe}
//                       onLikeRecipe={handleLikeRecipe}
//                       onFavoriteRecipe={handleFavoriteRecipe}
//                       onViewComments={handleViewComments}
//                       formatDate={formatDate}
//                       theme={theme} // Add theme prop
//                     />
//                   ))}
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
      
//       {/* Dialogs */}
//       {selectedRecipe && (
//         <>
//           <RecipeDialog
//             recipe={selectedRecipe}
//             isOpen={isRecipeDialogOpen}
//             onClose={() => setIsRecipeDialogOpen(false)}
//             onLike={handleLikeRecipe}
//             onFavorite={handleFavoriteRecipe}
//             onViewComments={handleViewComments}
//             onViewFullRecipe={() => {
//               // Navigate to recipe detail page
//               console.log("Viewing full recipe", selectedRecipe.id)
//             }}
//             formatDate={formatDate}
//             theme={theme} // Add theme prop
//           />
          
//           <CommentDialog
//             recipe={selectedRecipe}
//             comments={comments}
//             newComment={newComment}
//             onNewCommentChange={setNewComment}
//             onAddComment={handleAddComment}
//             isOpen={isCommentDialogOpen}
//             onClose={() => setIsCommentDialogOpen(false)}
//             formatDate={formatDate}
//           />
//         </>
//       )}
//     </div>
//   )
// }

// export default CommunityPage