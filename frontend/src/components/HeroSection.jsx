import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function HeroSection() {
  const { isAuthenticated } = useAuthContext();

  return (
    <section className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 animate-fade-in">Detect Deepfakes Effortlessly</h2>
        <p className="max-w-xl mx-auto mb-6">
          Upload videos or images and let our AI-powered analysis reveal potential deepfakes.
        </p>
        <Link
          to={isAuthenticated ? '/dashboard' : '/register'}

          className="inline-block bg-white text-indigo-700 font-semibold px-6 py-3 rounded shadow hover:scale-105 transition-transform"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}

