import client from './client';
import {
    LoginRequest,
    RegisterRequest,
    UpdatePasswordRequest,
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

    async updateProfile(data: FormData) {
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
    },
    getCurrentUser: async () => {
        try {
          const response = await client.get('/api/profile');
          return response.data;
        } catch (error) {
          console.error('Error fetching current user:', error);
          throw error;
        }
      },
    
      // Verify token validity
      verifyToken: async (token: string) => {
        try {
          const response = await client.post(`${BASE_URL}/verify-token`, { token });
          return response.data;
        } catch (error) {
          console.error('Token verification error:', error);
          throw error;
        }
      }
    };
    