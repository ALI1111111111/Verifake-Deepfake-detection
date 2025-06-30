import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthContext();

  return (
    <nav className="dashboard-navbar">
        <span className="nav-brand">DEEPFAKE DETECTOR</span>
        <div className="nav-links">
          <Link to="/#features">Features</Link>
          <Link to="/#contact">Contact</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
           <button onClick={logout}>
                Logout
              </button>
          
        </div>
      </nav>
  );
}
