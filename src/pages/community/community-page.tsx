import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ChefHat,
  Clock,
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Plus,
  User,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { useToast } from "../../hooks/use-toast";

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

export default function CommunityPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const { showToast } = useToast(); // Utilisation de showToast au lieu de toast
  const navigate = useNavigate();

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await fetch("/api/recipes");
      if (response.ok) {
        const data = await response.json();
        const recipesWithInteractions = data.content.map((recipe: Recipe) => ({
          ...recipe,
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          isLiked: Math.random() > 0.5,
          isFavorite: Math.random() > 0.7,
          categories:
            recipe.categories || ["Plat principal", "Végétarien", "Rapide"].slice(0, Math.floor(Math.random() * 3) + 1),
        }));
        setRecipes(recipesWithInteractions);
        setFilteredRecipes(recipesWithInteractions);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      showToast({
        title: "Erreur",
        description: "Impossible de charger les recettes",
        variant: "destructive",
      });
    }
  }, [showToast]);

  const filterRecipes = useCallback(() => {
    let filtered = [...recipes];

    if (searchQuery) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((recipe) => recipe.categories.includes(selectedCategory));
    }

    setFilteredRecipes(filtered);
  }, [recipes, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    if (recipes.length > 0) {
      filterRecipes();
    }
  }, [searchQuery, selectedCategory, recipes, filterRecipes]);

  const handleLikeRecipe = async (recipeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      setRecipes(
        recipes.map((recipe) => {
          if (recipe.id === recipeId) {
            const isLiked = !recipe.isLiked;
            return {
              ...recipe,
              isLiked,
              likes: isLiked ? recipe.likes + 1 : recipe.likes - 1,
            };
          }
          return recipe;
        }),
      );

      showToast({
        title: "Succès",
        description: "Votre appréciation a été enregistrée",
      });
    } catch (error) {
      console.error("Failed to like recipe:", error);
      showToast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const handleFavoriteRecipe = async (recipeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      setRecipes(
        recipes.map((recipe) => {
          if (recipe.id === recipeId) {
            return {
              ...recipe,
              isFavorite: !recipe.isFavorite,
            };
          }
          return recipe;
        }),
      );

      showToast({
        title: "Succès",
        description: "Recette ajoutée à vos favoris",
      });
    } catch (error) {
      console.error("Failed to favorite recipe:", error);
      showToast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeDialogOpen(true);
  };

  const handleViewComments = async (recipeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const mockComments: Comment[] = [
        {
          id: 1,
          content: "Cette recette est délicieuse ! Je l'ai essayée hier soir et toute ma famille a adoré.",
          user: { id: 101, name: "Sophie L." },
          creationDate: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 2,
          content: "Est-ce qu'on peut remplacer le beurre par de l'huile d'olive ?",
          user: { id: 102, name: "Marc D." },
          creationDate: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 3,
          content: "J'ai ajouté des épices supplémentaires et c'était parfait !",
          user: { id: 103, name: "Leila A." },
          creationDate: new Date(Date.now() - 259200000).toISOString(),
        },
      ];

      setComments(mockComments);

      const recipe = recipes.find((r) => r.id === recipeId);
      if (recipe) {
        setSelectedRecipe(recipe);
        setIsCommentsDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
      showToast({
        title: "Erreur",
        description: "Impossible de charger les commentaires",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedRecipe) return;

    try {
      const newCommentObj: Comment = {
        id: Math.floor(Math.random() * 1000),
        content: newComment,
        user: { id: 100, name: "Vous" },
        creationDate: new Date().toISOString(),
      };

      setComments([newCommentObj, ...comments]);
      setNewComment("");

      if (selectedRecipe) {
        setRecipes(
          recipes.map((recipe) => {
            if (recipe.id === selectedRecipe.id) {
              return {
                ...recipe,
                comments: recipe.comments + 1,
              };
            }
            return recipe;
          }),
        );
      }

      showToast({
        title: "Succès",
        description: "Votre commentaire a été ajouté",
      });
    } catch (error) {
      console.error("Failed to add comment:", error);
      showToast({
        title: "Erreur",
        description: "Impossible d'ajouter votre commentaire",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const allCategories = Array.from(new Set(recipes.flatMap((recipe) => recipe.categories)));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Communauté Cuisénio</h1>
          <p className="text-gray-600">Découvrez et partagez des recettes avec d'autres passionnés</p>
        </div>

        <Button className="bg-rose-500 hover:bg-rose-600 text-white" onClick={() => navigate("/recipes/create")}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter une recette
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar with filters */}
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
              {allCategories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer ${selectedCategory === category ? "bg-rose-500 hover:bg-rose-600" : ""}`}
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

        {/* Main content with recipes */}
        <div>
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Toutes les recettes</TabsTrigger>
              <TabsTrigger value="following">Abonnements</TabsTrigger>
              <TabsTrigger value="favorites">Favoris</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {filteredRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucune recette trouvée</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <Card
                      key={recipe.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleViewRecipe(recipe)}
                    >
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <img
                          src={recipe.imageUrl || "/placeholder.svg?height=400&width=600"}
                          alt={recipe.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{recipe.title}</CardTitle>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{recipe.preparationTime + recipe.cookingTime} min</span>
                          </div>
                        </div>
                        <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {recipe.categories.map((category) => (
                            <Badge key={category} variant="default" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={recipe.user.avatar || ""} alt={recipe.user.name} />
                            <AvatarFallback>{recipe.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{recipe.user.name}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`px-2 ${recipe.isLiked ? "text-rose-500" : "text-gray-500"}`}
                            onClick={(e) => handleLikeRecipe(recipe.id, e)}
                          >
                            <Heart className="h-4 w-4 mr-1" fill={recipe.isLiked ? "currentColor" : "none"} />
                            {recipe.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 text-gray-500"
                            onClick={(e) => handleViewComments(recipe.id, e)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {recipe.comments}
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`px-2 ${recipe.isFavorite ? "text-amber-500" : "text-gray-500"}`}
                          onClick={(e) => handleFavoriteRecipe(recipe.id, e)}
                        >
                          <Bookmark className="h-4 w-4" fill={recipe.isFavorite ? "currentColor" : "none"} />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="following">
              <div className="text-center py-12">
                <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Suivez d'autres utilisateurs</h3>
                <p className="text-gray-500 mb-4">Vous ne suivez aucun utilisateur pour le moment</p>
                <Button className="bg-rose-500 hover:bg-rose-600 text-white">Découvrir des utilisateurs</Button>
              </div>
            </TabsContent>

            <TabsContent value="favorites">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes
                  .filter((recipe) => recipe.isFavorite)
                  .map((recipe) => (
                    <Card
                      key={recipe.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleViewRecipe(recipe)}
                    >
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <img
                          src={recipe.imageUrl || "/placeholder.svg?height=400&width=600"}
                          alt={recipe.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{recipe.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={recipe.user.avatar || ""} alt={recipe.user.name} />
                            <AvatarFallback>{recipe.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{recipe.user.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-2 text-amber-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteRecipe(recipe.id, e);
                          }}
                        >
                          <Bookmark className="h-4 w-4" fill="currentColor" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Recipe Detail Dialog */}
      <Dialog open={isRecipeDialogOpen} onOpenChange={setIsRecipeDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRecipe.title}</DialogTitle>
                <DialogDescription>
                  Publié par {selectedRecipe.user.name} •{" "}
                  {formatDate(selectedRecipe.creationDate || new Date().toISOString())}
                </DialogDescription>
              </DialogHeader>

              <div className="relative h-64 w-full overflow-hidden rounded-lg my-4">
                <img
                  src={selectedRecipe.imageUrl || "/placeholder.svg?height=400&width=600"}
                  alt={selectedRecipe.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="grid gap-4">
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.categories.map((category) => (
                    <Badge key={category} variant="default">
                      {category}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {selectedRecipe.preparationTime + selectedRecipe.cookingTime} min
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChefHat className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{selectedRecipe.difficultyLevel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={selectedRecipe.isLiked ? "text-rose-500" : ""}
                      onClick={() => {
                        const mockEvent = { stopPropagation: () => {} } as React.MouseEvent;
                        handleLikeRecipe(selectedRecipe.id, mockEvent);
                      }}
                    >
                      <Heart className="h-4 w-4 mr-1" fill={selectedRecipe.isLiked ? "currentColor" : "none"} />
                      J'aime
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={selectedRecipe.isFavorite ? "text-amber-500" : ""}
                      onClick={() => {
                        const mockEvent = { stopPropagation: () => {} } as React.MouseEvent;
                        handleFavoriteRecipe(selectedRecipe.id, mockEvent);
                      }}
                    >
                      <Bookmark className="h-4 w-4 mr-1" fill={selectedRecipe.isFavorite ? "currentColor" : "none"} />
                      Favoris
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Partager
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700">{selectedRecipe.description}</p>

                <div className="pt-4">
                  <Button
                    onClick={() => {
                      setIsRecipeDialogOpen(false);
                      navigate(`/recipes/${selectedRecipe.id}`);
                    }}
                  >
                    Voir la recette complète
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog open={isCommentsDialogOpen} onOpenChange={setIsCommentsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle>Commentaires</DialogTitle>
                <DialogDescription>{selectedRecipe.title}</DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-2 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>V</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Ajouter un commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={handleAddComment}>Publier</Button>
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Aucun commentaire pour le moment</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.creationDate)}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}