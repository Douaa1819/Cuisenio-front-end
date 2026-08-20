import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Role } from "../types/auth.types"
import LoginForm from "../pages/auth/Login"
import RegisterForm from "../pages/auth/Register"
import ProfilePage from "../pages/profile/ProfilePage"
import CommunityPage from "../pages/community/community-page"
import MealPlannerPage from "../pages/meal-planner/meal-planner-page"
import AdminDashboard from "../pages/dashboard/AdminDashboard"
import NotFoundPage from "../pages/not-found-page"
import LandingPage from "../pages/LandingPage"
import PrivateRoute from "./PrivateRoute"

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected routes — any authenticated user */}
        <Route
          path="/community"
          element={
            <PrivateRoute>
              <CommunityPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/meal-planner"
          element={
            <PrivateRoute>
              <MealPlannerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Admin-only route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role={Role.ADMIN}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
