import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaBook, 
  FaTachometerAlt,
  FaCog,
  FaUserCircle,
  FaBell,
  FaComments,
  FaFileAlt
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: <FaTachometerAlt />,
      label: 'Dashboard'
    },
    {
      path: '/courses',
      icon: <FaBook />,
      label: 'Courses'
    },
    {
      path: '/chat',
      icon: <FaComments />,
      label: 'Direct Chat'
    },
    {
      path: '/review',
      icon: <FaFileAlt />,
      label: 'Peer Review'
    },
    {
      path: '/notifications',
      icon: <FaBell />,
      label: 'Notifications'
    },
    {
      path: '/profile',
      icon: <FaUserCircle />,
      label: 'Profile'
    },
    {
      path: '/settings',
      icon: <FaCog />,
      label: 'Settings'
    }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 