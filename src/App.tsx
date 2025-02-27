import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import CuisenioLandingPage from './components/pages/CuisenioLandingPage';
import { LoginForm } from './components/pages/auth/LoginForm';
import { RegisterForm } from './components/pages/auth/RegisterForm';
import AdminDashboard from './components/pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CuisenioLandingPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;