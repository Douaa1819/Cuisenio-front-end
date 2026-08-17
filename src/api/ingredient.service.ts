import  client  from './client';
import { routes } from './routes';
import {
  AliasIngredientRequest,
  IngredientResponse,
  IngredientRequest,
  IngredientCountResponse,
  MasterIngredient,
  NormalizeQuantityRequest,
  NormalizeQuantityResponse,
} from '../types/ingredient.types';
import { PageResponse } from '../types/error-response';

export const ingredientService = {
  findAll: async (page = 0, size = 100): Promise<PageResponse<IngredientResponse>> => {
    const response = await client.get(`${routes.ingredients.base}?page=${page}&size=${size}`);
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

  listMasterIngredients: async (): Promise<PageResponse<MasterIngredient>> => {
    const response = await client.get(routes.ingredients.masterBase);
    return response.data;
  },

  createMasterIngredient: async (data: { canonicalName: string }): Promise<MasterIngredient> => {
    const response = await client.post(routes.ingredients.masterBase, data);
    return response.data;
  },

  aliasIngredient: async (data: AliasIngredientRequest): Promise<IngredientResponse> => {
    const response = await client.post(routes.ingredients.alias, data);
    return response.data;
  },

  normalizeQuantity: async (data: NormalizeQuantityRequest): Promise<NormalizeQuantityResponse> => {
    const response = await client.post(routes.ingredients.normalize, data);
    return response.data;
  },
};