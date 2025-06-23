import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Deepfake Detector</h1>

      <div className="space-x-4">
        <Link to="/login" className="text-blue-500 underline">
          Login
        </Link>
        <Link to="/register" className="text-blue-500 underline">
          Register
        </Link>
      </div>

   

    </div>
  );
}
