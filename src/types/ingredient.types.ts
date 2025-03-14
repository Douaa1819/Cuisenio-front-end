export interface IngredientResponse {
    id: number;
    name: string;
  }
  
  export interface IngredientRequest {
    name: string;
  }
  
  export interface IngredientCountResponse {
    count: number;
  }

  export interface IngredientDetail {
    ingredientId: number;
    quantity: string;
    unit: string;
  }