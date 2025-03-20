import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import "./App.css"
import PrivateRoute from "./components/PrivateRoute"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import AdminDashboard from "./pages/dashboard/AdminDashboard"
import LandingPage from "./pages/LandingPage"
import ProfilePage from "./pages/profile/ProfilePage"
import CreateRecipePage from "./pages/recipes/create-recipe-page"
import CommunityPage from "./pages/community/community-page"
import MealPlannerPage from "./pages/meal-planner/meal-planner-page"
import NotFoundPage from "./pages/not-found-page"
import RecipeDetailPage from "./pages/community/recipe-detail"
// import EditRecipePage from "./pages/recipes/edit-recipe-page"
import { Role } from "./types/auth.types" 
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
  path="/dashboard"
  element={
    <PrivateRoute role={Role.ADMIN}>
      <AdminDashboard />
    </PrivateRoute>
  }
/>          <Route path="/add-recipe" element={<CreateRecipePage />} />
          {/* <Route path="/edit-recipe/:id" element={<EditRecipePage />} /> */}
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          <Route path="/home" element={<CommunityPage />} />
          <Route path="/meal-planner" element={<MealPlannerPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

