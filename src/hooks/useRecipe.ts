// src/pages/community/hooks/useRecipes.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Recipe,DifficultyLevel } from '../types/recipe.types';


const generateMockRecipes = (count: number): Recipe[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Recette délicieuse ${i + 1}`,
    description: `Une description appétissante pour la recette ${i + 1}. Parfaite pour toutes les occasions.`,
    difficultyLevel: (["EASY", "MEDIUM", "HARD"][Math.floor(Math.random() * 3)] as DifficultyLevel),
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
};

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipes - would be an API call in production
  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockRecipes = generateMockRecipes(12);
      setRecipes(mockRecipes);
      setFilteredRecipes(mockRecipes);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des recettes");
      setLoading(false);
      console.error("Error fetching recipes:", err);
    }
  }, []);

  // Filter recipes based on current criteria
  useEffect(() => {
    if (recipes.length > 0) {
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
        // Logic for following tab - this would be more robust in production
        filtered = filtered.filter(recipe => recipe.user.id === 1 || recipe.user.id === 3);
      }
      
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, selectedCategory, recipes, activeTab]);

  // Initialize data on component mount
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Recipe interaction handlers
  const handleLikeRecipe = useCallback((recipeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => {
        if (recipe.id === recipeId) {
          const isLiked = !recipe.isLiked;
          return {
            ...recipe,
            isLiked,
            likes: isLiked ? recipe.likes + 1 : recipe.likes - 1
          };
        }
        return recipe;
      })
    );
  }, []);

  const handleFavoriteRecipe = useCallback((recipeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => {
        if (recipe.id === recipeId) {
          return {
            ...recipe,
            isFavorite: !recipe.isFavorite
          };
        }
        return recipe;
      })
    );
  }, []);

  // Get all unique categories
  const allCategories = useMemo(() => 
    Array.from(new Set(recipes.flatMap(recipe => recipe.categories))),
    [recipes]
  );

  return {
    recipes,
    filteredRecipes,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeTab,
    setActiveTab,
    loading,
    error,
    handleLikeRecipe,
    handleFavoriteRecipe,
    allCategories,
    fetchRecipes
  };
};  