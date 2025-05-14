const Chat = require('../models/Chat');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Get all chats for a user
exports.getChats = async (req, res) => {
  console.log('========== GET /api/chat ==========');
  console.log('Request received at:', new Date().toISOString());
  console.log('User ID:', req.user?._id);
  console.log('Request headers:', req.headers);
  
  try {
    console.log('Attempting to find chats for user:', req.user?._id);
    const chats = await Chat.find({
      participants: req.user._id,
      status: 'active'
    })
    .populate('participants', 'name avatar')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    console.log('Found chats:', chats.length);
    console.log('Chat IDs:', chats.map(chat => chat._id));

    // Get unread counts for each chat
    const chatsWithUnreadCounts = chats.map(chat => {
      const unreadCount = chat.unreadCounts.find(
        count => count.user.toString() === req.user._id.toString()
      );
      return {
        ...chat.toObject(),
        unreadCount: unreadCount ? unreadCount.count : 0
      };
    });

    console.log('Sending response with', chatsWithUnreadCounts.length, 'chats');
    res.json(chatsWithUnreadCounts);
  } catch (error) {
    console.error('Error in getChats:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

// Get chat by ID
exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name avatar')
      .populate('messages.sender', 'name avatar');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is a participant
    if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark messages as read
    await chat.markAsRead(req.user._id);

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new chat or get existing one
exports.createChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    
    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { 
        $all: [req.user._id, participantId],
        $size: 2
      },
      status: 'active'
    });

    if (existingChat) {
      await existingChat.populate('participants', 'name avatar');
      return res.json(existingChat);
    }

    // Create new chat
    const chat = new Chat({
      participants: [req.user._id, participantId],
      unreadCounts: [
        { user: req.user._id, count: 0 },
        { user: participantId, count: 0 }
      ]
    });

    await chat.save();
    await chat.populate('participants', 'name avatar');

    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const chat = await Chat.findById(req.params.id).session(session);
    if (!chat) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is a participant
    if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messageData = {
      sender: req.user._id,
      content: req.body.content,
      attachments: req.body.attachments || []
    };

    const message = await chat.addMessage(messageData);

    // Create notifications for other participants
    const notifications = chat.participants
      .filter(p => p.toString() !== req.user._id.toString())
      .map(recipient => ({
        recipient,
        type: 'new_message',
        title: 'New Message',
        message: `${req.user.name}: ${req.body.content.substring(0, 50)}${req.body.content.length > 50 ? '...' : ''}`,
        actionUrl: `/chat/${chat._id}`,
        metadata: { chatId: chat._id, messageId: message._id }
      }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications, { session });
    }

    await session.commitTransaction();
    
    // Populate sender info for the response
    await message.populate('sender', 'name avatar');
    res.json(message);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// Archive chat
exports.archiveChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is a participant
    if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    chat.status = 'archived';
    await chat.save();

    res.json({ message: 'Chat archived successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get unread messages count
exports.getUnreadCount = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      status: 'active'
    });

    const totalUnread = chats.reduce((total, chat) => {
      const unreadCount = chat.unreadCounts.find(
        count => count.user.toString() === req.user._id.toString()
      );
      return total + (unreadCount ? unreadCount.count : 0);
    }, 0);

    res.json({ unreadCount: totalUnread });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 