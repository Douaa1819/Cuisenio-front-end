import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute, PublicRoute } from "./middleware/auth.middleware"
import LoginForm from "../pages/auth/Login"
import RegisterForm from "../pages/auth/Register"
import ProfilePage from "../pages/profile/ProfilePage"
import CommunityPage from "../pages/community/community-page"
import MealPlannerPage from "../pages/meal-planner/meal-planner-page"
import AdminDashboard from "../pages/dashboard/AdminDashboard"
import NotFoundPage from "../pages/not-found-page"
import LandingPage from "../pages/LandingPage"

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          }
        />

        {/* Routes protégées pour tous les utilisateurs authentifiés */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meal-planner"
          element={
            <ProtectedRoute>
              <MealPlannerPage />
            </ProtectedRoute>
          }
        />

        {/* Routes protégées pour les administrateurs uniquement */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Route 404 */}
        <Route path="/404" element={<NotFoundPage />} />

        {/* Redirection vers 404 pour toutes les autres routes */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

