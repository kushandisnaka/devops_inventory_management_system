import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginSignup.css';

export default function LoginSignup({ setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.email.indexOf('@') === -1) {
      setError('Please enter a valid email');
      return;
    }

    if (!isLogin) {
      if (!formData.fullName) {
        setError('Please enter your full name');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            fullName: formData.fullName,
            email: formData.email, 
            password: formData.password,
            confirmPassword: formData.confirmPassword
          };

      const response = await fetch(`http://13.49.125.245:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Login successful - navigate to home
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          setIsLoggedIn(true);
          navigate('/home');
        } else {
          // Signup successful - navigate to home
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          setIsLoggedIn(true);
          navigate('/home');
        }
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to connect to server. Make sure the backend is running on http://13.49.125.245:5000');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    });
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p>{isLogin ? 'Sign in to your inventory system' : 'Join us to manage your inventory'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-btn">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={toggleMode}
                className="toggle-btn"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        <div className="auth-illustration">
          <div className="illustration-content">
            <div className="circle-1"></div>
            <div className="circle-2"></div>
            <div className="circle-3"></div>
            <h2>{isLogin ? 'New to Inventory?' : 'Welcome Back!'}</h2>
            <p>
              {isLogin
                ? 'Create an account and start managing your inventory efficiently'
                : 'Access your inventory dashboard and track your items'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
