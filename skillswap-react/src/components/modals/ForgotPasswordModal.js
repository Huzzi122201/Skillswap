import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { authAPI } from '../../services/api';
import './ForgotPasswordModal.css';

const ForgotPasswordModal = () => {
  const { activeModal, closeModal, openModal } = useModal();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    // Basic email format check
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // Additional domain validation
    const [localPart, domain] = email.split('@');
    
    // Check local part length (max 64 characters)
    if (localPart.length > 64) {
      return false;
    }

    // Check domain part length (max 255 characters)
    if (domain.length > 255) {
      return false;
    }

    // Check if domain has valid TLD
    const validTLDs = [
      'com', 'net', 'org', 'edu', 'gov', 'mil', 'int',
      'info', 'biz', 'name', 'pro', 'museum', 'coop',
      'aero', 'xxx', 'idv', 'mobi', 'asia', 'tel',
      'pub', 'ai', 'dev', 'io', 'co', 'me', 'tv'
    ];

    const tld = domain.split('.').pop().toLowerCase();
    if (!validTLDs.includes(tld)) {
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError('');
    setSuccessMessage('');
    
    if (value.length > 0 && !validateEmail(value)) {
      setError('Please enter a valid email address');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await authAPI.requestPasswordReset(email);
      setSuccessMessage('Password reset instructions have been sent to your email. Please check your inbox and follow the instructions to reset your password.');
      setEmail('');
    } catch (err) {
      if (err.message === 'Server configuration error. Please contact support.') {
        setError('Unable to send reset email at the moment. Please try again later or contact support.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to send reset instructions. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (activeModal !== 'forgotPassword') return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Reset Password</h2>
        <p className="modal-description">Enter your email address and we'll send you instructions to reset your password.</p>
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="resetEmail">Email:</label>
            <input
              type="email"
              id="resetEmail"
              value={email}
              onChange={handleChange}
              className={error ? 'error' : ''}
              disabled={isLoading}
              placeholder="Enter your email address"
              required
            />
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
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              onClick={closeModal}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>
          <div className="form-footer">
            <span>Remember your password? </span>
            <button 
              type="button" 
              className="link-button"
              onClick={() => openModal('login')}
              disabled={isLoading}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal; 