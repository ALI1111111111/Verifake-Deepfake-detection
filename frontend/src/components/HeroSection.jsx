import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Button } from './ui/Button';

export default function HeroSection() {
  const { isAuthenticated } = useAuthContext();
  return (
    <section className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 animate-fade-in tracking-tight">
          Detect Deepfakes Effortlessly
        </h2>
        <p className="max-w-xl mx-auto mb-6 opacity-90">
          Upload videos or images and let our AI-powered analysis reveal potential deepfakes.
        </p>
        <Link to={isAuthenticated ? '/dashboard' : '/register'}>
          <Button variant="default" size="lg" className="mt-4">
            Get Started
          </Button>
        </Link>
      </div>
    </section>
  );
}
