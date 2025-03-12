import  client  from './client';
import { routes } from './routes';
import { IngredientResponse, IngredientRequest, IngredientCountResponse } from '../types/ingredient.types';
import { PageResponse } from '../types/error-response';

export const ingredientService = {
  findAll: async (): Promise<PageResponse<IngredientResponse>> => {
    const response = await client.get(routes.ingredients.base);
    return response.data;
  },

  findById: async (id: number): Promise<IngredientResponse> => {
    const response = await client.get(routes.ingredients.detail(id));
    return response.data;
  },

  getCount: async (): Promise<IngredientCountResponse> => {
    const response = await client.get(routes.ingredients.count);
    return response.data;
  },

  create: async (data: IngredientRequest): Promise<IngredientResponse> => {
    const response = await client.post(routes.ingredients.base, data);
    return response.data;
  },

  update: async (id: number, data: IngredientRequest): Promise<IngredientResponse> => {
    const response = await client.put(routes.ingredients.detail(id), data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(routes.ingredients.detail(id));
  },
};