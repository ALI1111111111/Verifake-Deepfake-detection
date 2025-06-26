import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || password !== confirm) {
      toast.error('Please fill all fields correctly');
      return;
    }
    try {
      setLoading(true);
      await api.post('/auth/register', { name, email, password });
      toast.success('Registered successfully');
      navigate('/login');
    } finally {
      setLoading(false);
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
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">Join VeriFake to start detecting deep fakes</p>
            <p className="terms-notice">
              By continuing, you agree to VeriFake's{' '}
              <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>.
            </p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                id="fullname"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <input
                type="email"
                id="signup-email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                type="password"
                id="signup-password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                className="form-control"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </form>
          <div className="switch-form">
            <p>
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
