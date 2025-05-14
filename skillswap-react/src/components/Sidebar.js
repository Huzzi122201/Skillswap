import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      title: 'Dashboard',
      icon: 'bx bxs-dashboard',
      path: '/dashboard'
    },
    {
      title: 'Courses',
      icon: 'bx bxs-book-alt',
      path: '/courses'
    },
    {
      title: 'Community',
      icon: 'bx bxs-group',
      path: '/community'
    },
    {
      title: 'Direct Chat',
      icon: 'bx bxs-message-dots',
      path: '/chat'
    },
    {
      title: 'Peer Review',
      icon: 'bx bxs-file',
      path: '/review'
    },
    {
      title: 'Profile',
      icon: 'bx bxs-user',
      path: '/profile'
    },
    {
      title: 'Settings',
      icon: 'bx bxs-cog',
      path: '/settings'
    }
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/logo.png" alt="SkillSwap" />
        <h1>SkillSwap</h1>
      </div>
      <nav className="nav-menu">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <i className={item.icon}></i>
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 