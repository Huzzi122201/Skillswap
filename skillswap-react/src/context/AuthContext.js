import React, { createContext, useState, useContext, useEffect } from 'react';
import { api, authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Get current user data
  const getCurrentUser = async () => {
    try {
      const { user } = await authAPI.getCurrentUser();
      setCurrentUser(user);
      setError(null);
    } catch (err) {
      console.error('Error getting current user:', err);
      setError(err.response?.data?.message || 'Failed to fetch user data');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const { token, user } = await authAPI.login(email, password);
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      setError(null);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      throw err;
    }
  };

  // Register user
  const signup = async (userData) => {
    try {
      const { token, user } = await authAPI.register(userData);
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      setError(null);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // First, clear all local state
      setCurrentUser(null);
      setError(null);
      
      // Remove token from localStorage and API headers
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // Then call the backend logout endpoint
      await authAPI.logout();
      
      // Clear any other auth-related storage
      localStorage.clear(); // Clear all localStorage items
      sessionStorage.clear(); // Clear all sessionStorage items
      
      // Force reload the application to clear any remaining state
      window.location.href = '/';
    } catch (err) {
      console.error('Error during logout:', err);
      // Even if the backend call fails, we still want to clear local state
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await authAPI.requestPasswordReset(email);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      setCurrentUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    }
  };

  // Social login handlers
  const socialLogin = async (provider, accessToken) => {
    try {
      const response = await api.post(`/auth/${provider}`, { access_token: accessToken });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      setError(null);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during social login');
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    socialLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 