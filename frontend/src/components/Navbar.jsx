import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthContext();

  return (
    <nav className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center shadow">
      <h1 className="text-lg font-semibold">
        <Link to="/">Deepfake Detector</Link>
      </h1>
      <div className="space-x-4">
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
