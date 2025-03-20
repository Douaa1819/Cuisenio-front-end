import { useAuthStore } from "../store/auth.store"
import { Navigate } from "react-router-dom"
import { Role } from "../types/auth.types" 
interface PrivateRouteProps {
  children: React.ReactElement
  role?: Role
}
const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PrivateRoute