const api = require('./api');

const chatService = {
  getConversations: async () => {
    const response = await api.get('/chats');
    return response.data;
  },

  getMessages: async (chatId) => {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
  },

  sendMessage: async (chatId, messageData) => {
    const response = await api.post(`/chats/${chatId}/messages`, messageData);
    return response.data;
  },

  createChat: async (participantId) => {
    const response = await api.post('/chats', { participantId });
    return response.data;
  },

  markAsRead: async (chatId) => {
    const response = await api.put(`/chats/${chatId}/read`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/chats/unread');
    return response.data;
  }
};

module.exports = chatService; 