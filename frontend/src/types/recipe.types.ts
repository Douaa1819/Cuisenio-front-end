
export enum DifficultyLevel {
  EASY = "EASY",
  MEDIUM = "INTERMEDIATE",
  HARD = "ADVANCED",
}

export type RecipeWorkflowStatus = "draft" | "pending_review" | "published" | "rejected"

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

export interface KitchenTool {
  name: string
  affiliateUrl?: string
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
  publicId?: string
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
  isFeatured?: boolean
  status?: RecipeWorkflowStatus
  videoUrl?: string
  likesCount?: number
  commentsCount?: number
  likedByCurrentUser?: boolean
  user: {
    id: number
    username: string 
    lastName: string 
    email: string
    profilePicture: string
    badge?: "Beginner" | "Chef" | "Verified"
  }
  categories: {
    id: number
    name: string
    type: string
  }[]
  recipeIngredients: RecipeIngredientResponse[]
  steps: RecipeStepResponse[]
  instructions?: string
  kitchenTools?: KitchenTool[]
  averageRating: number
  totalRatings: number
  totalComments: number
  categorie?: { id: number; name: string }
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
  approved?: boolean;
  user?: {
    id: number;
    username: string;
    lastName: string;
  };
}

export interface ModerationReportItem {
  recipeId: number
  title: string
  reportCount: number
  latestReason: string
  lastReportedAt: string
  urgency: number
}

/** Public UUID used in frontend routes and public API paths. */
export function recipePath(recipe: { publicId?: string | null }): string {
  return recipe.publicId ? `/recipe/${recipe.publicId}` : "/discover"
}

export function recipeEditPath(recipe: { publicId?: string | null }): string {
  return recipe.publicId ? `/edit-recipe/${recipe.publicId}` : "/chef"
}

const RECIPE_PUBLIC_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isRecipePublicId(value: string | undefined | null): boolean {
  return Boolean(value && RECIPE_PUBLIC_ID_RE.test(value))
}
