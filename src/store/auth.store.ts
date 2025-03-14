import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AuthState {
  token: string | null
  user: {
    id?: number
    username?: string
    email?: string
    profilePicture?: string
  } | null
  isAuthenticated: boolean
  login: (token: string, userData: { id?: number; username?: string; email?: string; profilePicture?: string }) => void
  logout: () => void
  updateUser: (userData: { id?: number; username?: string; email?: string; profilePicture?: string }) => void
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

