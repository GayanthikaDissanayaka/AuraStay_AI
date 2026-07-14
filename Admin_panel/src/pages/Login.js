import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Hotel Administrator');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', role);
      localStorage.setItem('user', JSON.stringify({
        email: user.email,
        uid: user.uid,
        role: role,
        name: user.displayName || 'Admin'
      }));
      
      navigate('/admin', { replace: true });
      
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('User not found. Please register first.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="back-button" onClick={handleBack}>
          <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </button>

        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Admin Portal</h1>
            <p className="login-subtitle">Manage your hotel operations</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">@</span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@hotel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                >
                  <option>Hotel Administrator</option>
                  <option>Front Desk Manager</option>
                  <option>Housekeeping Supervisor</option>
                  <option>Maintenance Manager</option>
                  <option>Restaurant Manager</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="signin-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Signing In...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <button type="button" className="register-link" onClick={handleRegister}>
                Register Your Hotel
              </button>
            </p>
            <div className="signup-prompt">
              <button type="button" className="signup-link" onClick={handleSignUp}>
                Sign Up as New User
              </button>
            </div>
            <div className="security-note">
              ○ Authorized personnel only. All activities are logged.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;