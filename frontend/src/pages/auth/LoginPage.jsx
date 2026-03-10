import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../styles/forms.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    Promise.resolve(login(form))
      .then(() => navigate('/admin'))
      .catch(() => setError('Login failed. Please try again.'));
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-card-inner">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to manage your society effortlessly.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="form-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter secure password"
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </div>
              {error && <div className="form-error">{error}</div>}
            </div>
            <button type="submit" className="btn-primary">
              Sign in
            </button>
          </form>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            New to SocioSphere?{' '}
            <Link to="/signup">
              <button type="button" className="btn-ghost">
                Create an account
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

