import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
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
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
              <LoginForm />
          }
        />

        <Route
          path="/register"
          element={
              <RegisterForm />
          }
        />

        <Route
          path="/profile"
          element={
              <ProfilePage />
          }
        />

        <Route
          path="/community"
          element={
              <CommunityPage />
          }
        />

        <Route
          path="/meal-planner"
          element={
              <MealPlannerPage />
          }
        />

        <Route
          path="/dashboard"
          element={
              <AdminDashboard />

            }
        />

        <Route path="/404" element={<NotFoundPage />} />

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

