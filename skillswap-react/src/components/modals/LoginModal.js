import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import './LoginModal.css';

const LoginModal = () => {
  const { activeModal, closeModal, openModal } = useModal();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (value.length > 0) {
      if (name === 'email' && !validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else if (name === 'password' && !validatePassword(value)) {
        setErrors(prev => ({ ...prev, password: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character' }));
      } else {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    } else {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail(formData.email) && validatePassword(formData.password)) {
      setIsSubmitting(true);
      try {
        await login(formData.email, formData.password);
        // Clear form data
        setFormData({ email: '', password: '' });
        setErrors({});
        closeModal();
      } catch (err) {
        setErrors(prev => ({ ...prev, general: err.message || 'Login failed' }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (activeModal !== 'login') return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          {errors.general && <div className="error-message">{errors.general}</div>}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <div className="form-footer">
            <button 
              type="button"
              className="link-button"
              onClick={() => openModal('forgotPassword')}
              disabled={isSubmitting}
            >
              Forgot Password?
            </button>
            <button 
              type="button"
              className="link-button"
              onClick={() => openModal('signup')}
              disabled={isSubmitting}
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal; 