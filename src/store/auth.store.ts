import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Role, normalizeRole } from "../types/auth.types"

export interface User {
  id?: number
  username?: string
  lastName?: string
  email?: string
  profilePicture?: string
  role?: Role
  isShadowBanned?: boolean
}

export interface AuthState {
  /** Short-lived access JWT — kept in memory + sessionStorage for Axios. */
  token: string | null
  user: User | null
  isAuthenticated: boolean
  /** True after sessionStorage rehydration completes — prevents auth flash redirects. */
  hasHydrated: boolean
  login: (token: string, userData: User) => void
  logout: (options?: { redirect?: boolean }) => void
  updateUser: (userData: Partial<User>) => void
  setHasHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      login: (token, userData) => {
        const role = normalizeRole(userData.role)
        sessionStorage.setItem("token", token)
        set({
          token,
          user: { ...userData, role },
          isAuthenticated: true,
        })
      },

      logout: (options = { redirect: true }) => {
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("auth-storage")
        set({ token: null, user: null, isAuthenticated: false })
        if (options.redirect !== false) {
          window.location.replace("/login")
        }
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...userData,
                role: userData.role ? normalizeRole(userData.role) : state.user.role,
              }
            : null,
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      /**
       * IMPORTANT: do NOT call useAuthStore here — it runs during create()
       * and triggers "Cannot access 'useAuthStore' before initialization".
       * Only touch sessionStorage; finish hydration in onFinishHydration.
       */
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("[auth] rehydration failed — clearing session", error)
          try {
            sessionStorage.removeItem("auth-storage")
            sessionStorage.removeItem("token")
          } catch {
            /* ignore */
          }
          return
        }
        if (state?.token) {
          try {
            sessionStorage.setItem("token", state.token)
          } catch {
            /* ignore */
          }
        }
      },
    },
  ),
)

function finishHydration() {
  const current = useAuthStore.getState()
  const token = current.token ?? sessionStorage.getItem("token")
  const user = current.user
    ? { ...current.user, role: normalizeRole(current.user.role) }
    : null

  useAuthStore.setState({
    token: token,
    user,
    isAuthenticated: Boolean(token),
    hasHydrated: true,
  })
}

/** Safe 401 handling: ignore if already logged out or mid-login. */
let loggingOut = false
window.addEventListener("auth:unauthorized", () => {
  const { token, isAuthenticated, logout } = useAuthStore.getState()
  if (loggingOut || !token || !isAuthenticated) return
  loggingOut = true
  try {
    sessionStorage.setItem("cuisenio:session-expired", "1")
  } catch {
    /* ignore */
  }
  logout({ redirect: true })
  loggingOut = false
})

void useAuthStore.persist.onFinishHydration(() => {
  finishHydration()
})

if (useAuthStore.persist.hasHydrated()) {
  finishHydration()
}

// Failsafe: never leave Login/Register stuck on a boot loader
window.setTimeout(() => {
  if (!useAuthStore.getState().hasHydrated) {
    console.warn("[auth] hydration timeout — forcing hasHydrated=true")
    finishHydration()
  }
}, 150)
