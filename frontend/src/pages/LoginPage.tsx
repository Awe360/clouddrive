import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginPageProps {
  login: (email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  error: string | null;
  setError: (err: string | null) => void;
}

export default function LoginPage({ login, isAuthenticated, error, setError }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on load
  useEffect(() => {
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="brand-logo">☁️</span>
          <h1 className="brand-title">CloudDrive</h1>
        </div>
        <p className="brand-tagline">
          Secure, fast, and simple file storage in the cloud. Access your files anywhere, anytime.
        </p>
        <div className="auth-features">
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <div>
              <h3>Private S3 Storage</h3>
              <p>Your files are protected with server-side encryption and accessible only via temporary presigned links.</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <div>
              <h3>Blazing Fast Downloads</h3>
              <p>Direct download architecture routes your files straight from AWS S3 without passing through secondary servers.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card glass-card">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to access your dashboard</p>

          {error && <div className="auth-error-alert">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
