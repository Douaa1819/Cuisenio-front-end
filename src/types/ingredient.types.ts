export interface IngredientResponse {
    id: number;
    name: string;
    masterIngredientId?: number;
  }
  
  export interface IngredientRequest {
    name: string;
  }
  
  export interface IngredientCountResponse {
    count: number;
  }

  export interface IngredientDetail {
    ingredientId: number;
    recipeId: number;
    quantity: string;
    unit: string;
  }

export interface MasterIngredient {
  id: number
  canonicalName: string
}

export interface AliasIngredientRequest {
  aliasName: string
  masterIngredientId: number
}

export interface NormalizeQuantityRequest {
  quantity: number
  unit: string
  ingredientName?: string
}

export interface NormalizeQuantityResponse {
  normalizedQuantity: number
  normalizedUnit: "g" | "ml"
  sourceQuantity: number
  sourceUnit: string
}