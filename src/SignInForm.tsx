import React, { useState } from 'react';
import './SignInForm.css';

interface FormErrors {
  email?: string; // Will act as username
  password?: string;
}

interface AlertState {
  type: 'success' | 'danger';
  message: string;
}

export default function SignInForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [alert, setAlert] = useState<AlertState | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!username.trim()) {
      newErrors.email = 'Username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const endpoint = isSignUp ? '/users/register' : '/users/login';
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setAlert({
        type: 'success',
        message: isSignUp ? 'Successfully registered! Please sign in.' : 'Successfully logged in!',
      });
      
      if (!isSignUp) {
        // Handle token storage
        console.log('Token:', data.access_token);
      } else {
        setIsSignUp(false);
        setUsername('');
        setPassword('');
      }
    } catch (err: any) {
      setAlert({
        type: 'danger',
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-page-container">
      <div className="signin-card">
        <div className="signin-header">
          <h2 className="signin-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="signin-subtitle">Please enter your details to {isSignUp ? 'sign up' : 'sign in'}</p>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert">
            <span>{alert.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="signin-form" noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className={`form-input ${errors.email ? 'has-error' : ''}`}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="form-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'has-error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="signup-prompt">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <a href="#" className="signup-link" onClick={(e) => { e.preventDefault(); setIsSignUp(!isSignUp); setAlert(null); }}>
            {isSignUp ? 'Sign in' : 'Sign up'}
          </a>
        </div>
      </div>
    </div>
  );
}
