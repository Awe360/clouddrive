import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface RegisterPageProps {
  register: (name: string, email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  error: string | null;
  setError: (err: string | null) => void;
}

export default function RegisterPage({ register, isAuthenticated, error, setError }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const success = await register(name, email, password);
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
            <span className="feature-icon">📁</span>
            <div>
              <h3>Organize Files Easily</h3>
              <p>Store documents, images, code files, or archives with no configuration or complexity.</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">☁️</span>
            <div>
              <h3>AWS Standard Infrastructure</h3>
              <p>Experience enterprise architecture standards including virtual private networking, RDS, and S3.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card glass-card">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Get started with 5GB free storage</p>

          {error && <div className="auth-error-alert">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password (min 6 chars)</label>
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
