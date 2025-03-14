import client from "./client"
import type { LoginRequest, RegisterRequest, UpdatePasswordRequest, UserProfile } from "../types/auth.types"

const BASE_URL = "/v1/auth"
const PROFILE_URL = "/v1/profile"

export const authService = {
  async register(data: RegisterRequest) {
    const response = await client.post(`${BASE_URL}/register`, data)
    return response.data
  },

  async login(data: LoginRequest) {
    const response = await client.post(`${BASE_URL}/login`, data)
    this.setToken(response.data.token)

    // Check user role and redirect accordingly
    if (response.data.role === "ADMIN") {
      window.location.href = "/dashboard"
    } else {
      window.location.href = "/home"
    }

    return response.data
  },

  async getProfile() {
    const response = await client.get<UserProfile>(`${PROFILE_URL}`)
    return response.data
  },

  async updateProfile(data: FormData) {
    const response = await client.put<UserProfile>(`${PROFILE_URL}`, data)
    return response.data
  },

  async updatePassword(data: UpdatePasswordRequest) {
    await client.put(`${PROFILE_URL}/password`, data)
  },

  async deleteAccount() {
    await client.delete(`${PROFILE_URL}`)
  },

  setToken(token: string) {
    localStorage.setItem("token", token)
  },

  getToken() {
    return localStorage.getItem("token")
  },

  async logout() {
    this.removeToken()
    window.location.href = "/login"
  },

  removeToken() {
    localStorage.removeItem("token")
  },

  getCurrentUser: async () => {
    try {
      const response = await client.get("/api/profile")
      return response.data
    } catch (error) {
      console.error("Error fetching current user:", error)
      throw error
    }
  },

  // Verify token validity
  verifyToken: async (token: string) => {
    try {
      const response = await client.post(`${BASE_URL}/verify-token`, { token })
      return response.data
    } catch (error) {
      console.error("Token verification error:", error)
      throw error
    }
  },
}

