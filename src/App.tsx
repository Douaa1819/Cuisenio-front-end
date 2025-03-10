import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/profile/ProfilePage';
import MealPlannerPage from './pages/meal-planner/meal-planner-page';
import CreateRecipePage from './pages/recipes/create-recipe-page';
import CommunityPage from './pages/community/community-page';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/Meal-planner" element={<MealPlannerPage />} />
        <Route path="/Add-recipe" element={<CreateRecipePage />} />
        <Route path="/home" element={<CommunityPage />} />

          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
