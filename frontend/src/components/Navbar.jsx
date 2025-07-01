import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthContext();

  return (
    <nav className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center shadow fixed w-full z-10 top-0 dark:bg-gray-800">
      <h1 className="text-lg font-semibold">
        <Link to="/">Deepfake Detector</Link>
      </h1>
      <div className="flex items-center space-x-4">
        <Link to="/#features" className="hover:underline">Features</Link>
        <Link to="/#contact" className="hover:underline">Contact</Link>
        <DarkModeToggle />
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/profile" className="hover:underline">Profile</Link>
            <button onClick={logout} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
