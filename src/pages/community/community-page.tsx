// import { useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { Search, Filter, Clock, Heart, Plus, X } from 'lucide-react';

// // Hooks
// import { useRecipes } from "../../hooks/useComments";
// // import { useComments } from "../../hooks/useComments";

// // Components
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Badge } from "../../components/ui/badge";
// import RecipeCard from "../../components/recipe/RecipeCard";
// import RecipeDialog from "../../components/recipe/RecipeDialog";
// import CommentDialog from "../../components/recipe/CommentDialog";

// // Types
// import { Recipe } from "../../types/recipe.types";

// const CommunityPage = () => {
//   const navigate = useNavigate();
  
//   // Recipe state and handlers from custom hook
//   const {
//     filteredRecipes,
//     searchQuery,
//     setSearchQuery,
//     selectedCategory,
//     setSelectedCategory,
//     activeTab,
//     setActiveTab,
//     loading,
//     handleLikeRecipe,
//     handleFavoriteRecipe,
//     allCategories
//   } = useRecipes();

//   // Recipe and Comments dialog state
//   const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
//   const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
//   const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);

//   // Comments functionality from custom hook
//   const { 
//     comments, 
//     newComment, 
//     setNewComment, 
//     handleAddComment, 
//     fetchComments 
//   } = useComments();

//   // Format date utility
//   const formatDate = useCallback((dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
//   }, []);

//   // Handler for viewing a recipe
//   const handleViewRecipe = useCallback((recipe: Recipe) => {
//     setSelectedRecipe(recipe);
//     setIsRecipeDialogOpen(true);
//   }, []);

//   // Handler for viewing comments
//   const handleViewComments = useCallback((recipeId: number, event: React.MouseEvent) => {
//     event.stopPropagation();
//     fetchComments(recipeId);
    
//     const recipe = filteredRecipes.find(r => r.id === recipeId);
//     if (recipe) {
//       setSelectedRecipe(recipe);
//       setIsCommentsDialogOpen(true);
//     }
//   }, [filteredRecipes, fetchComments]);

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       {/* Header section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">Communauté Cuisénio</h1>
//           <p className="text-gray-600">Découvrez et partagez des recettes avec d'autres passionnés</p>
//         </div>
        
//         <Button 
//           className="bg-rose-500 hover:bg-rose-600 text-white"
//           onClick={() => navigate('/recipes/create')}
//         >
//           <Plus className="h-4 w-4 mr-2" /> Ajouter une recette
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
//         {/* Sidebar with filters */}
//         <div className="space-y-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input 
//               placeholder="Rechercher des recettes..." 
//               className="pl-10"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
          
//           <div>
//             <h3 className="font-medium mb-3">Catégories</h3>
//             <div className="flex flex-wrap gap-2">
//               {allCategories.map(category => (
//                 <Badge 
//                   key={category} 
//                   variant={selectedCategory === category ? "default" : "outline"}
//                   className={`cursor-pointer ${selectedCategory === category ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
//                   onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
//                 >
//                   {category}
//                 </Badge>
//               ))}
//             </div>
//           </div>
          
//           <div>
//             <h3 className="font-medium mb-3">Filtrer par</h3>
//             <div className="space-y-2">
//               <Button variant="outline" className="w-full justify-start">
//                 <Filter className="h-4 w-4 mr-2" /> Les plus populaires
//               </Button>
//               <Button variant="outline" className="w-full justify-start">
//                 <Clock className="h-4 w-4 mr-2" /> Les plus récentes
//               </Button>
//               <Button variant="outline" className="w-full justify-start">
//                 <Heart className="h-4 w-4 mr-2" /> Mes favoris
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Main content with recipes */}
//         <div>
//           {/* Tabs */}
//           <div className="mb-6 border-b">
//             <div className="flex space-x-4">
//               <button 
//                 className={`pb-2 px-1 font-medium ${activeTab === 'all' ? 'border-b-2 border-rose-500 text-rose-500' : 'text-gray-500'}`}
//                 onClick={() => setActiveTab('all')}
//               >
//                 Toutes les recettes
//               </button>
//               <button 
//                 className={`pb-2 px-1 font-medium ${activeTab === 'following' ? 'border-b-2 border-rose-500 text-rose-500' : 'text-gray-500'}`}
//                 onClick={() => setActiveTab('following')}
//               >
//                 Abonnements
//               </button>
//               <button 
//                 className={`pb-2 px-1 font-medium ${activeTab === 'favorites' ? 'border-b-2 border-rose-500 text-rose-500' : 'text-gray-500'}`}
//                 onClick={() => setActiveTab('favorites')}
//               >
//                 Favoris
//               </button>
//             </div>
//           </div>
          
//           {/* Loading state */}
//           {loading ? (
//             <div className="text-center py-12">
//               <p className="text-gray-500">Chargement des recettes...</p>
//             </div>
//           ) : filteredRecipes.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-500">Aucune recette trouvée</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredRecipes.map(recipe => (
//                 <RecipeCard 
//                   key={recipe.id} 
//                   recipe={recipe}
//                   onViewRecipe={handleViewRecipe}
//                   onLikeRecipe={handleLikeRecipe}
//                   onFavoriteRecipe={handleFavoriteRecipe}
//                   onViewComments={handleViewComments}
//                   formatDate={formatDate}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Recipe detail dialog */}
//       {isRecipeDialogOpen && selectedRecipe && (
//         <RecipeDialog 
//           recipe={selectedRecipe}
//           isOpen={isRecipeDialogOpen}
//           onClose={() => setIsRecipeDialogOpen(false)}
//           onLike={handleLikeRecipe}
//           onFavorite={handleFavoriteRecipe}
//           onViewComments={handleViewComments}
//           onViewFullRecipe={() => {
//             setIsRecipeDialogOpen(false);
//             navigate(`/recipes/${selectedRecipe.id}`);
//           }}
//           formatDate={formatDate}
//         />
//       )}

//       {/* Comments dialog */}
//       {isCommentsDialogOpen && selectedRecipe && (
//         <CommentDialog 
//           recipe={selectedRecipe}
//           comments={comments}
//           newComment={newComment}
//           onNewCommentChange={setNewComment}
//           onAddComment={() => handleAddComment(selectedRecipe.id)}
//           isOpen={isCommentsDialogOpen}
//           onClose={() => setIsCommentsDialogOpen(false)}
//           formatDate={formatDate}
//         />
//       )}
//     </div>
//   );
// };

// export default CommunityPage;