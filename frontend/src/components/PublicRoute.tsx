import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/auth.store"
import { homePathForRole } from "../types/auth.types"

interface PublicRouteProps {
  children: React.ReactElement
}

/** Visible boot skeleton — never rely solely on undefined CSS tokens. */
const AuthBootLoader = () => (
  <div
    className="flex min-h-screen items-center justify-center bg-background"
    role="status"
    aria-label="Chargement de la session"
  >
    <div className="w-full max-w-md space-y-4 px-6">
      <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-primary/30" />
      <div className="mx-auto h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
      <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
      <div className="h-10 w-full animate-pulse rounded-lg bg-primary/25" />
    </div>
  </div>
)

const PublicRoute = ({ children }: PublicRouteProps) => {
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)

  if (!hasHydrated) {
    return <AuthBootLoader />
  }

  if (isAuthenticated && token) {
    return <Navigate to={homePathForRole(user?.role)} replace />
  }

  return children
}

export default PublicRoute
