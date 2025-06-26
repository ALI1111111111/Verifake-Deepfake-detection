import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    try {
      await login(email, password);
    } catch {
      // handled by interceptor
    }
  };

  return (
    <div className="container">
      <div className="brand-section">
        <div className="brand-logo">
          <i className="fas fa-shield-alt" />VeriFake
        </div>
        <h1 className="brand-title">Detect Deep Fakes with Precision</h1>
        <p className="brand-subtitle">
          Advanced AI-powered detection for videos, images, and audio files
        </p>
        <ul className="features-list">
          <li>
            <i className="fas fa-bolt" /> Real-time deep fake detection
          </li>
          <li>
            <i className="fas fa-lock" /> Military-grade security
          </li>
          <li>
            <i className="fas fa-chart-line" /> 98.7% detection accuracy
          </li>
          <li>
            <i className="fas fa-cloud" /> Secure cloud processing
          </li>
        </ul>
      </div>
      <div className="form-section">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">
              Sign in to access your VeriFake account
            </p>
            <p className="terms-notice">
              By continuing, you agree to VeriFake's{' '}
              <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>.
            </p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Log In'}
            </button>
          </form>
          <div className="switch-form">
            <p>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
