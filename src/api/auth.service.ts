import client from "./client"
import type { LoginRequest, RegisterRequest, UpdatePasswordRequest, UserProfile } from "../types/auth.types"
import { routes } from "./routes"

const TOKEN_KEY = "token"
const STORAGE = sessionStorage

export const authService = {
  async register(data: RegisterRequest) {
    const response = await client.post(routes.auth.register, data)
    return response.data
  },

  async login(data: LoginRequest) {
    const response = await client.post(routes.auth.login, data)
    this.setToken(response.data.token)
    return response.data
  },

  async getProfile(): Promise<UserProfile> {
    const response = await client.get<UserProfile>(routes.profile)
    return response.data
  },

  async updateProfile(data: FormData): Promise<UserProfile> {
    const response = await client.put<UserProfile>(routes.profile, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  async updatePassword(data: UpdatePasswordRequest): Promise<void> {
    await client.put(`${routes.profile}/password`, data)
  },

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await client.post(routes.auth.forgotPassword, { email })
    return response.data
  },

  async verifyResetToken(token: string): Promise<{ valid: boolean }> {
    const response = await client.get(routes.auth.verifyResetToken(token))
    return response.data
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await client.post(routes.auth.resetPassword, { token, newPassword })
    return response.data
  },

  async deleteAccount(): Promise<void> {
    await client.delete(routes.profile)
  },

  setToken(token: string): void {
    STORAGE.setItem(TOKEN_KEY, token)
  },

  getToken(): string | null {
    return STORAGE.getItem(TOKEN_KEY)
  },

  removeToken(): void {
    STORAGE.removeItem(TOKEN_KEY)
    STORAGE.removeItem("auth-storage")
  },
}
