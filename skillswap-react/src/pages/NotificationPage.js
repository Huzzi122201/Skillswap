import React, { useState, useEffect } from 'react';
import '../styles/NotificationPage.css';
import { FaCheckCircle, FaComments, FaBell, FaUserFriends, FaStar } from 'react-icons/fa';
import { notificationService } from '../services/notificationService';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true }
          : notification
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(notification => 
        notification._id !== notificationId
      ));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_message':
        return <FaComments className="notification-icon message" />;
      case 'course_update':
        return <FaBell className="notification-icon course" />;
      case 'achievement_earned':
        return <FaStar className="notification-icon review" />;
      case 'community_mention':
      case 'post_comment':
      case 'post_like':
        return <FaUserFriends className="notification-icon social" />;
      default:
        return <FaBell className="notification-icon" />;
    }
  };

  if (loading) {
    return (
      <div className="notification-page">
        <div className="loading-spinner">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="notification-page">
      <div className="notification-header">
        <div className="header-content">
          <h1>Notifications</h1>
          <div className="notification-actions">
            <button 
              className="mark-all-read"
              onClick={markAllAsRead}
            >
              <FaCheckCircle />
              Mark all as read
            </button>
          </div>
        </div>
      </div>

      <div className="notifications-container">
        {notifications.length > 0 ? (
          <div className="notifications-list">
            {notifications.map(notification => (
              <div 
                key={notification._id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => markAsRead(notification._id)}
              >
                <div className="notification-content">
                  {getNotificationIcon(notification.type)}
                  <div className="notification-text">
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button 
                  className="delete-notification"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-notifications">
            <FaBell className="empty-icon" />
            <h2>No notifications</h2>
            <p>You're all caught up! Check back later for new updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage; 