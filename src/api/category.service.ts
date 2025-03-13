import { CategoryCountResponse, CategoryRequest, CategoryResponse } from '../types/category.types';
import client from './client';


const BASE_URL = '/v1/categories';

export const categoryService = {
    async findAll(page: number = 0, size: number = 10) {
        const response = await client.get<Page<CategoryResponse>>(`${BASE_URL}?page=${page}&size=${size}`);
        console.log(response);
        return response.data;
    },

    async findById(id: number) {
        const response = await client.get<CategoryResponse>(`${BASE_URL}/${id}`);
        return response.data;
    },

    async create(data: CategoryRequest) {
        const response = await client.post<CategoryResponse>(BASE_URL, data);
        return response.data;
    },

    getCount : async (): Promise<CategoryCountResponse>=>{
        const response = await client.get<CategoryCountResponse>(`${BASE_URL}/count`);
        return response.data;
    }
,

    async update(id: number, data: CategoryRequest) {
        const response = await client.put<CategoryResponse>(`${BASE_URL}/${id}`, data);
        return response.data;
    },

    async delete(id: number) {
        await client.delete(`${BASE_URL}/${id}`);
    },
};

interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}