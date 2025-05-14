import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import '../styles/ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const { openModal } = useModal();

  if (!currentUser) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to access this page.</p>
        <button className="login-btn" onClick={() => openModal('login')}>
          Log In
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 