import client from './client';
import { CategoryResponse, CategoryRequest } from '../types/category.types';

const BASE_URL = '/v1/categories';

export const categoryService = {
    async findAll(page: number = 0, size: number = 10) {
        const response = await client.get<Page<CategoryResponse>>(`${BASE_URL}?page=${page}&size=${size}`);
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