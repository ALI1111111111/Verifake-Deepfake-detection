import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ResultsPage from './pages/ResultsPage';
<<<<<<< HEAD
import ProfilePage from './pages/ProfilePage';
=======
>>>>>>> main
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/results" element={<ResultsPage />} />
<<<<<<< HEAD
        <Route path="/profile" element={<ProfilePage />} />
=======
>>>>>>> main
      </Route>
    </Routes>
  );
}
