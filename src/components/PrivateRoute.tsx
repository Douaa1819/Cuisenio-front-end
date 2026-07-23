import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/auth.store"
import { Role, normalizeRole } from "../types/auth.types"

interface PrivateRouteProps {
  children: React.ReactElement
  /** If provided, only users with this role may access the route. */
  role?: Role
}

const AuthBootLoader = () => (
  <div
    className="flex min-h-screen items-center justify-center bg-[#0A0A0A]"
    role="status"
    aria-label="Chargement de la session"
  >
    <div className="w-full max-w-lg space-y-3 px-6">
      <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
      <div className="h-24 w-full animate-pulse rounded-xl bg-white/8" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 animate-pulse rounded-xl bg-white/8" />
        <div className="h-20 animate-pulse rounded-xl bg-white/8" />
        <div className="h-20 animate-pulse rounded-xl bg-white/8" />
      </div>
    </div>
  </div>
)

/**
 * Waits for Zustand persist rehydration before deciding auth.
 * Without this gate, a cold load briefly sees isAuthenticated=false and
 * bounces authenticated users to /login.
 */
const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)

  if (!hasHydrated) {
    return <AuthBootLoader />
  }

  const sessionOk = Boolean(isAuthenticated && token)

  if (!sessionOk) {
    return <Navigate to="/login" replace />
  }

  if (role && normalizeRole(user?.role) !== role) {
    return <Navigate to={normalizeRole(user?.role) === Role.ADMIN ? "/dashboard" : "/chef"} replace />
  }

  return children
}

export default PrivateRoute
