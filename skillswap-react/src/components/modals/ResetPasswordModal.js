import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './ResetPasswordModal.css';

const ResetPasswordModal = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  // Store the opener URL when component mounts
  const [openerUrl, setOpenerUrl] = useState('');
  useEffect(() => {
    // Get the opener's URL if it exists
    if (window.opener) {
      try {
        setOpenerUrl(window.opener.location.href);
      } catch (e) {
        // If we can't access opener's URL, use a default
        setOpenerUrl(process.env.FRONTEND_URL || window.location.origin);
      }
    }
  }, []);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate password
    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.resetPassword(token, newPassword);
      setSuccessMessage('Password has been reset successfully!');
      
      // After successful reset:
      setTimeout(() => {
        // 1. If there's an opener window, send message and close current tab
        if (window.opener) {
          // Send message to opener to show login modal
          window.opener.postMessage({ type: 'SHOW_LOGIN_MODAL' }, '*');
          // Ensure we close this tab
          window.close();
        } else {
          // If no opener (opened directly), redirect to home with login parameter
          const baseUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
          window.location.href = `${baseUrl}?showLogin=true`;
        }
      }, 1500);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-content">
          <h2>Invalid Reset Link</h2>
          <p>This password reset link is invalid or has expired. Please request a new password reset.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/forgot-password')}
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-content">
        <h2>Reset Your Password</h2>
        <p className="description">Please enter your new password below.</p>
        
        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={error && !validatePassword(newPassword) ? 'error' : ''}
              disabled={isLoading}
              required
            />
            <small className="password-requirements">
              Password must contain at least 8 characters, including uppercase, lowercase, number and special character.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={error && newPassword !== confirmPassword ? 'error' : ''}
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
          {successMessage && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i> {successMessage}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal; 