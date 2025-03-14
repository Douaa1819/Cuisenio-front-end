import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id?: number
  username?: string
  email?: string
  profilePicture?: string
  role?: string
}

export interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, userData) => set({ token, user: userData, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),
    }),
    {
      name: "auth-storage",
    },
  ),
)
