import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ChefHat, Clock, Heart, MessageSquare, Bookmark, Share2, Plus,  X, Send } from 'lucide-react';

// Importez vos composants UI
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

// Types
interface UserType {
  id: number;
  name: string;
  avatar?: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  difficultyLevel: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  imageUrl: string;
  user: UserType;
  categories: string[];
  likes: number;
  comments: number;
  creationDate: string;
  isLiked?: boolean;
  isFavorite?: boolean;
}

interface Comment {
  id: number;
  content: string;
  user: UserType;
  creationDate: string;
}

const CommunityPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (recipes.length > 0) {
      filterRecipes();
    }
  }, [searchQuery, selectedCategory, recipes, activeTab]);

  const fetchRecipes = async () => {
    try {
      // Simuler un appel API avec des données fictives
      const mockRecipes: Recipe[] = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Recette délicieuse ${i + 1}`,
        description: `Une description appétissante pour la recette ${i + 1}. Parfaite pour toutes les occasions.`,
        difficultyLevel: ["EASY", "MEDIUM", "HARD"][Math.floor(Math.random() * 3)],
        preparationTime: Math.floor(Math.random() * 30) + 10,
        cookingTime: Math.floor(Math.random() * 60) + 15,
        servings: Math.floor(Math.random() * 4) + 2,
        imageUrl: `/placeholder.svg?height=400&width=600&text=Recette+${i + 1}`,
        user: {
          id: Math.floor(Math.random() * 5) + 1,
          name: ["Sophie L.", "Marc D.", "Leila A.", "Thomas B.", "Julie M."][Math.floor(Math.random() * 5)],
          avatar: `/placeholder.svg?height=50&width=50&text=${Math.floor(Math.random() * 5) + 1}`
        },
        categories: ["Plat principal", "Végétarien", "Dessert", "Entrée", "Rapide", "Sans gluten"]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1),
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        isLiked: Math.random() > 0.5,
        isFavorite: Math.random() > 0.7,
        creationDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString()
      }));

      setRecipes(mockRecipes);
      setFilteredRecipes(mockRecipes);
    } catch (error) {
      console.error("Erreur lors du chargement des recettes:", error);
    }
  };

  const filterRecipes = () => {
    let filtered = [...recipes];
    
    if (searchQuery) {
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(recipe => 
        recipe.categories.includes(selectedCategory)
      );
    }

    if (activeTab === "favorites") {
      filtered = filtered.filter(recipe => recipe.isFavorite);
    } else if (activeTab === "following") {
      // Logique pour les abonnements - pour l'instant, on retourne un sous-ensemble
      filtered = filtered.filter(recipe => recipe.user.id === 1 || recipe.user.id === 3);
    }
    
    setFilteredRecipes(filtered);
  };

  const handleLikeRecipe = (recipeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setRecipes(recipes.map(recipe => {
      if (recipe.id === recipeId) {
        const isLiked = !recipe.isLiked;
        return {
          ...recipe,
          isLiked,
          likes: isLiked ? recipe.likes + 1 : recipe.likes - 1
        };
      }
      return recipe;
    }));
  };

  const handleFavoriteRecipe = (recipeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setRecipes(recipes.map(recipe => {
      if (recipe.id === recipeId) {
        return {
          ...recipe,
          isFavorite: !recipe.isFavorite
        };
      }
      return recipe;
    }));
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeDialogOpen(true);
  };

  const handleViewComments = (recipeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Générer des commentaires fictifs
    const mockComments: Comment[] = [
      {
        id: 1,
        content: "Cette recette est délicieuse ! Je l'ai essayée hier soir et toute ma famille a adoré.",
        user: { id: 101, name: "Sophie L." },
        creationDate: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 2,
        content: "Est-ce qu'on peut remplacer le beurre par de l'huile d'olive ?",
        user: { id: 102, name: "Marc D." },
        creationDate: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 3,
        content: "J'ai ajouté des épices supplémentaires et c'était parfait !",
        user: { id: 103, name: "Leila A." },
        creationDate: new Date(Date.now() - 259200000).toISOString()
      }
    ];
    
    setComments(mockComments);
    
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      setSelectedRecipe(recipe);
      setIsCommentsDialogOpen(true);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedRecipe) return;
    
    const newCommentObj: Comment = {
      id: Math.floor(Math.random() * 1000),
      content: newComment,
      user: { id: 100, name: "Vous" },
      creationDate: new Date().toISOString()
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment("");
    
    // Mettre à jour le nombre de commentaires
    setRecipes(recipes.map(recipe => {
      if (recipe.id === selectedRecipe.id) {
        return {
          ...recipe,
          comments: recipe.comments + 1
        };
      }
      return recipe;
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Obtenir toutes les catégories uniques
  const allCategories = Array.from(new Set(recipes.flatMap(recipe => recipe.categories)));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Communauté Cuisénio</h1>
          <p className="text-gray-600">Découvrez et partagez des recettes avec d'autres passionnés</p>
        </div>
        
        <Button 
          className="bg-rose-500 hover:bg-rose-600 text-white"
          onClick={() => navigate('/recipes/create')}
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter une recette
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar avec filtres */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher des recettes..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Catégories</h3>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(category => (
                <Badge 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer ${selectedCategory === category ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Filtrer par</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Filter className="h-4 w-4 mr-2" /> Les plus populaires
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" /> Les plus récentes
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" /> Mes favoris
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu principal avec recettes */}
        <div>
          <div className="mb-6 border-b">
            <div className="flex space-x-4">
              <button 
                className={`pb-2 px-1 font-medium ${activeTab === 'all' ? 'border-b-2 border-rose-500 text-rose-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('all')}
              >
                Toutes les recettes
              </button>
              <button 
                className={`pb-2 px-1 font-medium ${activeTab === 'following' ? 'border-b-2 border-rose-500 text-rose-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('following')}
              >
                Abonnements
              </button>
              <button 
                className={`pb-2 px-1 font-medium ${activeTab === 'favorites' ? 'border-b-2 border-rose-500 text-rose-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('favorites')}
              >
                Favoris
              </button>
            </div>
          </div>
          
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune recette trouvée</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <Card 
                  key={recipe.id} 
                  className="overflow-hidden border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <div className="absolute top-2 right-2 z-10">
                      <button 
                        className={`p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm ${recipe.isFavorite ? 'text-amber-500' : 'text-gray-500'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteRecipe(recipe.id, e);
                        }}
                      >
                        <Bookmark className="h-5 w-5" fill={recipe.isFavorite ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <img 
                      src={recipe.imageUrl || "/placeholder.svg?height=400&width=600"} 
                      alt={recipe.title}
                      className="object-cover w-full h-64 cursor-pointer"
                      onClick={() => handleViewRecipe(recipe)}
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                        <img 
                          src={recipe.user.avatar || `/placeholder.svg?height=50&width=50&text=${recipe.user.name.charAt(0)}`} 
                          alt={recipe.user.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{recipe.user.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(recipe.creationDate)}</p>
                      </div>
                    </div>
                    
                    <h3 
                      className="text-lg font-semibold mb-1 cursor-pointer hover:text-rose-500 transition-colors"
                      onClick={() => handleViewRecipe(recipe)}
                    >
                      {recipe.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {recipe.categories.map(category => (
                        <Badge key={category} variant="default" className="bg-rose-100 text-rose-700 hover:bg-rose-200">
                          {category}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.preparationTime + recipe.cookingTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ChefHat className="h-4 w-4" />
                        <span>
                          {recipe.difficultyLevel === "EASY" && "Facile"}
                          {recipe.difficultyLevel === "MEDIUM" && "Moyen"}
                          {recipe.difficultyLevel === "HARD" && "Difficile"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 px-4 py-3">
                    <div className="flex justify-between items-center">
                      <button 
                        className={`flex items-center gap-1 ${recipe.isLiked ? 'text-rose-500' : 'text-gray-500'} hover:text-rose-500 transition-colors`}
                        onClick={(e) => handleLikeRecipe(recipe.id, e)}
                      >
                        <Heart className="h-5 w-5" fill={recipe.isLiked ? "currentColor" : "none"} />
                        <span>{recipe.likes}</span>
                      </button>
                      
                      <button 
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={(e) => handleViewComments(recipe.id, e)}
                      >
                        <MessageSquare className="h-5 w-5" />
                        <span>{recipe.comments}</span>
                      </button>
                      
                      <button className="text-gray-500 hover:text-gray-700 transition-colors">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialogue de détail de recette */}
      {isRecipeDialogOpen && selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{selectedRecipe.title}</h2>
              <button 
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => setIsRecipeDialogOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative h-80 w-full mb-4">
                <img 
                  src={selectedRecipe.imageUrl || "/placeholder.svg?height=400&width=600"} 
                  alt={selectedRecipe.title}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={selectedRecipe.user.avatar || `/placeholder.svg?height=50&width=50&text=${selectedRecipe.user.name.charAt(0)}`} 
                    alt={selectedRecipe.user.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedRecipe.user.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(selectedRecipe.creationDate)}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedRecipe.categories.map(category => (
                  <Badge key={category} variant="default" className="bg-rose-100 text-rose-700">
                    {category}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center mb-4 text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{selectedRecipe.preparationTime + selectedRecipe.cookingTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-4 w-4 text-gray-500" />
                    <span>
                      {selectedRecipe.difficultyLevel === "EASY" && "Facile"}
                      {selectedRecipe.difficultyLevel === "MEDIUM" && "Moyen"}
                      {selectedRecipe.difficultyLevel === "HARD" && "Difficile"}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">{selectedRecipe.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <button 
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${
                      selectedRecipe.isLiked 
                        ? 'border-rose-200 bg-rose-50 text-rose-500' 
                        : 'border-gray-200 text-gray-700'
                    }`}
                    onClick={(e) => handleLikeRecipe(selectedRecipe.id, e)}
                  >
                    <Heart className="h-4 w-4" fill={selectedRecipe.isLiked ? "currentColor" : "none"} />
                    <span>{selectedRecipe.isLiked ? 'Aimé' : 'J\'aime'}</span>
                  </button>
                  
                  <button 
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700"
                    onClick={(e) => handleViewComments(selectedRecipe.id, e)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Commenter</span>
                  </button>
                </div>
                
                <button 
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${
                    selectedRecipe.isFavorite 
                      ? 'border-amber-200 bg-amber-50 text-amber-500' 
                      : 'border-gray-200 text-gray-700'
                  }`}
                  onClick={(e) => handleFavoriteRecipe(selectedRecipe.id, e)}
                >
                  <Bookmark className="h-4 w-4" fill={selectedRecipe.isFavorite ? "currentColor" : "none"} />
                  <span>{selectedRecipe.isFavorite ? 'Sauvegardé' : 'Sauvegarder'}</span>
                </button>
              </div>
              
              <Button 
                className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                onClick={() => {
                  setIsRecipeDialogOpen(false);
                  navigate(`/recipes/${selectedRecipe.id}`);
                }}
              >
                Voir la recette complète
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialogue de commentaires */}
      {isCommentsDialogOpen && selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full h-[600px] max-h-[90vh] flex flex-col">
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Commentaires</h2>
              <button 
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => setIsCommentsDialogOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">Aucun commentaire pour le moment</p>
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="flex gap-3 pb-4 border-b border-gray-100">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img 
                        src={`/placeholder.svg?height=50&width=50&text=${comment.user.name.charAt(0)}`} 
                        alt={comment.user.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <p className="font-medium text-sm">{comment.user.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(comment.creationDate)}</p>
                      </div>
                      <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="border-t border-gray-100 p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img 
                    src="/placeholder.svg?height=50&width=50&text=V" 
                    alt="Votre avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 flex gap-2">
                  <Input 
                    placeholder="Ajouter un commentaire..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
