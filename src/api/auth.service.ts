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
        this.setToken(response.data.token);
        console.log(response);
        return response.data;
    },

    async getProfile() {
        const response = await client.get<UserProfile>(`${PROFILE_URL}`);
        console.log(response);
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

    setToken(token: string) {
        localStorage.setItem('token', token);
    },

    getToken() {
        const t = localStorage.getItem('token');
        console.log("token"+t);
        return t;
    },

    async logout() {
        this.removeToken();

        window.location.href = '/login'; 
    },

    removeToken() {
        localStorage.removeItem('token');
    }
};