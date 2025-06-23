import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Deepfake Detector</h1>
      <Link to="/login" className="text-blue-500 underline">
        Login to continue
      </Link>
    </div>
  );
}
