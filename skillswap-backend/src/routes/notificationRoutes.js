const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Get all notifications for the current user
router.get('/', auth, notificationController.getNotifications);

// Mark a notification as read
router.patch('/:id/read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/read/all', auth, notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', auth, notificationController.deleteNotification);

// Delete all read notifications
router.delete('/read/all', auth, notificationController.deleteAllRead);

// Get unread notifications count
router.get('/unread/count', auth, notificationController.getUnreadCount);

module.exports = router; 