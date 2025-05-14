import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import LoginModal from './components/modals/LoginModal';
import SignupModal from './components/modals/SignupModal';
import ForgotPasswordModal from './components/modals/ForgotPasswordModal';
import ResetPasswordModal from './components/modals/ResetPasswordModal';
import './styles/global.css';
import Navbar from './components/Navbar';
import CoursesPage from './pages/CoursesPage';
import SkillMatchPage from './pages/SkillMatchPage';
import CommunityPage from './pages/CommunityPage';
import ChatPage from './pages/ChatPage';
import ReviewPage from './pages/ReviewPage';
import NotificationPage from './pages/NotificationPage';
import { useModal } from './context/ModalContext';
import './App.css';

function AppContent() {
  const { openModal } = useModal();
  const location = useLocation();

  useEffect(() => {
    // Handle message from reset password window
    const handleMessage = (event) => {
      if (event.data?.type === 'SHOW_LOGIN_MODAL') {
        // Add a small delay to ensure proper state management
        setTimeout(() => {
          openModal('login');
        }, 100);
      }
    };

    window.addEventListener('message', handleMessage);

    // Check URL parameter for showing login modal
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('showLogin') === 'true') {
      // Add a small delay to ensure proper state management
      setTimeout(() => {
        openModal('login');
        // Clean up the URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }, 100);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [openModal, location]);

  return (
    <div className="app">
      <Navbar />
      <Routes>
        {/* Public Routes - No Sidebar */}
        <Route path="/" element={<Home />} />
        <Route path="/reset-password" element={<ResetPasswordModal />} />
        <Route path="/forgot-password" element={<ForgotPasswordModal />} />
        
        {/* Protected Routes - With Sidebar */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/skill-match" element={<SkillMatchPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Route>
      </Routes>
      <LoginModal />
      <SignupModal />
      <ForgotPasswordModal />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
