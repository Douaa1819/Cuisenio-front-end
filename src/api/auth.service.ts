import client from "./client"
import type { LoginRequest, RegisterRequest, UpdatePasswordRequest, UserProfile } from "../types/auth.types"
import { routes } from "./routes"

export const authService = {
  async register(data: RegisterRequest) {
    const response = await client.post(`${routes.auth.register}`, data)
    return response.data
  },

  async login(data: LoginRequest) {
    const response = await client.post(`${routes.auth.login}`, data)
    this.setToken(response.data.token)

    if (response.data.role === "ADMIN") {
      window.location.href = "/dashboard"
    } else {
      window.location.href = "/home"
    }

    return response.data
  },

  async getProfile() {
    const response = await client.get<UserProfile>(`${routes.profile}`)
    return response.data
  },

  async updateProfile(data: FormData) {
    const response = await client.put<UserProfile>(`${routes.profile}`, data)
    return response.data
  },

  async updatePassword(data: UpdatePasswordRequest) {
    await client.put(`${routes.profile}/password`, data)
  },

  async deleteAccount() {
    await client.delete(`${routes.profile}`)
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
      const response = await client.get(routes.profile)
      return response.data
    } catch (error) {
      console.error("Error fetching current user:", error)
      throw error
    }
  },

  verifyToken: async (token: string) => {
    try {
      const response = await client.post(`${routes.auth.verify}`, { token })
      return response.data
    } catch (error) {
      console.error("Token verification error:", error)
      throw error
    }
  },
}

