import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaBell, FaHandshake, FaUsers, FaSignOutAlt, FaCog, FaUserCircle } from 'react-icons/fa';
import 'boxicons/css/boxicons.min.css';
import '../styles/navigation.css';

const Navbar = () => {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const { openModal } = useModal();
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const handleLogout = () => {
    logout();
    // If on a protected route, redirect to home
    if (!isHomePage) {
      window.location.href = '/';
    }
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <i className='bx bx-transfer-alt'></i>
          SkillSwap
        </Link>
        
        <button className="menu-toggle" onClick={toggleMenu}>
          <i className={`bx ${isMenuActive ? 'bx-x' : 'bx-menu'}`}></i>
        </button>

        <ul className={`menu ${isMenuActive ? 'active' : ''}`}>
          <li>
            <Link to="/dashboard">
              <i className='bx bx-grid-alt'></i>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/courses">
              <i className='bx bx-book-open'></i>
              Courses
            </Link>
          </li>
          <li>
            <Link to="/community">
              <FaUsers />
              Community
            </Link>
          </li>
          <li>
            <Link to="/skill-match">
              <FaHandshake />
              Skill Match
            </Link>
          </li>
          
          <li className="nav-actions">
            {currentUser ? (
              <div className="user-actions">
                <Link to="/notifications" className="notification-icon">
                  <FaBell />
                  <span className="notification-badge">3</span>
                </Link>
                <div className="user-profile">
                  <Link to="/profile" className="profile-icon">
                    <FaUserCircle />
                  </Link>
                  <div className="user-menu">
                    <span className="username">{currentUser.username}</span>
                    <Link to="/profile" className="menu-item">
                      <FaUser />
                      Profile
                    </Link>
                    <Link to="/settings" className="menu-item">
                      <FaCog />
                      Settings
                    </Link>
                    <button onClick={handleLogout} className="logout-button">
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              isHomePage && (
                <div className="auth-buttons">
                  <Link to="#" className="btn-login" onClick={(e) => {
                    e.preventDefault();
                    openModal('login');
                  }}>
                    Login
                  </Link>
                  <Link to="#" className="btn-join" onClick={(e) => {
                    e.preventDefault();
                    openModal('signup');
                  }}>
                    Join Now
                  </Link>
                </div>
              )
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 