// src/types/recipe.types.ts

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface UserType {
  id: number;
  name: string;
  avatar?: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  difficultyLevel: DifficultyLevel;
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

export interface Comment {
  id: number;
  content: string;
  user: UserType;
  creationDate: string;
}

// To be used later when implementing real API
export interface RecipeFilters {
  search?: string;
  category?: string;
  sortBy?: 'popular' | 'recent';
  userOnly?: boolean;
  favorites?: boolean;
}