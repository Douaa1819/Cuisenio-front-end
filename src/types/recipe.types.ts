
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
  ingredientName: string
  quantity: string
  unit: string
}

export interface RecipeStepRequest {
  stepNumber: number
  description: string
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
  servings: number
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
  chef: {
    id: number
    username: string
    email: string
    profilePicture: string
  }
  categories: {
    id: number
    name: string
    type: string
  }[]
  ingredients: RecipeIngredientResponse[]
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

