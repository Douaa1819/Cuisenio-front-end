import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/auth.store"
import { Role } from "../types/auth.types"

interface PrivateRouteProps {
  children: React.ReactElement
  /** If set, only users with this role can access the route. */
  role?: Role
}

const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role && user?.role !== role) {
    // Non-admin trying to reach an admin-only route → back to community
    return <Navigate to="/community" replace />
  }

  return children
}

export default PrivateRoute
