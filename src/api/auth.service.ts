// src/api/auth.service.ts
import client from './client';
import {
    LoginRequest,
    RegisterRequest,
    UpdatePasswordRequest,
    UpdateProfileRequest,
    UserProfile
} from '../types/auth.types';

const BASE_URL = '/v1/auth';
const PROFILE_URL = '/v1/profile';

export const authService = {
    async register(data: RegisterRequest) {
        const response = await client.post(`${BASE_URL}/register`, data);
        
        return response.data;
    },

    async login(data: LoginRequest) {
        const response = await client.post(`${BASE_URL}/login`, data);
        return response.data;
    },

    async getProfile() {
        const response = await client.get<UserProfile>(`${PROFILE_URL}`);
        return response.data;
    },

    async updateProfile(data: UpdateProfileRequest) {
        const response = await client.put<UserProfile>(`${PROFILE_URL}`, data);
        return response.data;
    },

    async updatePassword(data: UpdatePasswordRequest) {
        await client.put(`${PROFILE_URL}/password`, data);
    },

    async deleteAccount() {
        await client.delete(`${PROFILE_URL}`);
    },

    // Store and remove token in local storage
    setToken(token: string) {
        localStorage.setItem('token', token);
    },

    getToken() {
        return localStorage.getItem('token');
    },

    removeToken() {
        localStorage.removeItem('token');
    }
};