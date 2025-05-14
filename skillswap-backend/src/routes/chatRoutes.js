const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Get all chats for the current user
router.get('/', auth, chatController.getChats);

// Get a specific chat by ID
router.get('/:id', auth, chatController.getChat);

// Create a new chat or get existing one
router.post('/', auth, chatController.createChat);

// Send a message in a chat
router.post('/:id/messages', auth, chatController.sendMessage);

// Archive a chat
router.patch('/:id/archive', auth, chatController.archiveChat);

// Get unread messages count
router.get('/unread/count', auth, chatController.getUnreadCount);

module.exports = router; 