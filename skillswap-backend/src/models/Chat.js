const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    name: String,
    size: Number
  }],
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [messageSchema],
  lastMessage: {
    type: messageSchema,
    default: null
  },
  unreadCounts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    count: {
      type: Number,
      default: 0
    }
  }],
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
chatSchema.index({ participants: 1 });
chatSchema.index({ 'messages.createdAt': -1 });
chatSchema.index({ 'unreadCounts.user': 1 });

// Method to mark messages as read
chatSchema.methods.markAsRead = async function(userId) {
  const unreadCount = this.unreadCounts.find(
    count => count.user.toString() === userId.toString()
  );
  if (unreadCount) {
    unreadCount.count = 0;
  }
  
  this.messages.forEach(message => {
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
    }
  });

  await this.save();
};

// Method to add a new message
chatSchema.methods.addMessage = async function(messageData) {
  const message = {
    ...messageData,
    readBy: [messageData.sender]
  };

  this.messages.push(message);
  this.lastMessage = message;

  // Update unread counts for all participants except sender
  this.unreadCounts.forEach(count => {
    if (count.user.toString() !== messageData.sender.toString()) {
      count.count += 1;
    }
  });

  await this.save();
  return message;
};

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat; 