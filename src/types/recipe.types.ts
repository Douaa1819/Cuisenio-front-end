
export enum DifficultyLevel {
  EASY = "EASY",
  MEDIUM = "INTERMEDIATE",
  HARD = "ADVANCED",
}

export interface RecipeIngredientRequest {
  ingredientId: number
  quantity: string
  unit: string
}

export interface RecipeIngredientResponse {
  id: number
  quantity: string
  unit: string
    ingredient:{
      id: number
      name: string
    }
}

export interface RecipeStepRequest {
  stepNumber: number
  description: string
}

export interface Recipe {
  id: number
  title: string
  imageUrl?: string
  description: string
  preparationTime: number
  cookingTime: number
  difficultyLevel: "EASY" | "MEDIUM" | "HARD"
  categories: string[]
  isFavorite: boolean
  comments: string
  likes: number
  isLiked: boolean
  creationDate: string
  user: {
    name: string
    profilePicture: string

  }
}

export interface RecipeStepResponse {
  id: number
  stepNumber: number
  description: string
}


export interface RecipeRequest {
  title: string
  description: string
  difficultyLevel: DifficultyLevel
  preparationTime: number
  cookingTime: number
  creationDate: string
  servings: number
  user: {
    id: number
    username: string 
    lastName: string 
    email: string
    profilePicture: string
  }
  categories: {
    id: number
    name: string
    type: string
  }[]
  
  imageUrl?: File
  categoryIds: number[]
  ingredients: RecipeIngredientRequest[]
  steps: RecipeStepRequest[]
}


export interface RecipeResponse {
  id: number
  title: string
  description: string
  difficultyLevel: DifficultyLevel
  preparationTime: number
  cookingTime: number
  servings: number
  imageUrl: string
  creationDate: string
  updateDate: string
  isApproved: boolean
  user: {
    id: number
    username: string 
    lastName: string 
    email: string
    profilePicture: string
  }
  categories: {
    id: number
    name: string
    type: string
  }[]
  recipeIngredients: RecipeIngredientResponse[]
  steps: RecipeStepResponse[]
  averageRating: number
  totalRatings: number
  totalComments: number
}


export interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}


export interface RecipeCommentRequest {
  content: string;
}

export interface RecipeCommentResponse {
  id: number;
  content: string;
  createdAt: string;
  approved: boolean;
  user: {
    id: number;
    username: string;
    lastName: string;
  };
}
