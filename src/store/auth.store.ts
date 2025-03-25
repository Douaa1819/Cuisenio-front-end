import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Role } from "../types/auth.types" 
import { authService } from "../api/auth.service"

export interface User {
  id?: number
  username?: string
  lastName?: string
  email?: string
  profilePicture?: string
  role?: Role 
}

export interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, userData) => set({ token, user: userData, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      updateUser: (userData) => set((state) => ({ 
        user: { ...state.user, ...userData } 
      })),
      initialize: async () => {
        const token = localStorage.getItem("auth-storage")
          ? JSON.parse(localStorage.getItem("auth-storage")!).state.token
          : null

        if (token) {
          try {
            const userData = await authService.getCurrentUser()
            set({ 
              token,
              user: userData,
              isAuthenticated: true 
            })
          } catch {
            set({ 
              token: null, 
              user: null, 
              isAuthenticated: false 
            })
            localStorage.removeItem("auth-storage")
          }
        }
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => async (state) => {
        if (state?.token) {
          await state.initialize()
        }
      }
    }
  )
)