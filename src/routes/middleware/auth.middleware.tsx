"use client"

import { type ReactNode, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../../store/auth.store"

type Role = "ADMIN" | "USER" | undefined

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: Role[]
  redirectPath?: string
}

/**
 * Middleware pour protéger les routes en fonction du rôle de l'utilisateur
 */
export const ProtectedRoute = ({
  children,
  allowedRoles = ["USER", "ADMIN"],
  redirectPath = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectPath, { state: { from: location.pathname } })
      return
    }

    if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role as Role)) {
      navigate("/", { replace: true })
    }
  }, [isAuthenticated, user, navigate, redirectPath, location.pathname, allowedRoles])

  if (isAuthenticated && (!allowedRoles.length || (user?.role && allowedRoles.includes(user.role as Role)))) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E57373]"></div>
    </div>
  )
}


export const PublicRoute = ({
  children,
  redirectPath = "/",
}: {
  children: ReactNode
  redirectPath?: string
}) => {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "ADMIN") {
        navigate("/dashboard", { replace: true })
      } else {
        navigate(redirectPath, { replace: true })
      }
    }
  }, [isAuthenticated, navigate, redirectPath, user])

  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E57373]"></div>
    </div>
  )
}

