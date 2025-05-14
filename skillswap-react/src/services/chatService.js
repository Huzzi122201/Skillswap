import { api } from './api';

export const chatService = {
    // Get all chats
    getChats: async () => {
        try {
            const response = await api.get('/chat');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get a specific chat
    getChatById: async (chatId) => {
        try {
            const response = await api.get(`/chat/${chatId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create a new chat
    createChat: async (participantId) => {
        try {
            const response = await api.post('/chat', { participantId });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Send a message
    sendMessage: async (chatId, content) => {
        try {
            const response = await api.post(`/chat/${chatId}/messages`, { content });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Mark messages as read
    markAsRead: async (chatId) => {
        try {
            const response = await api.patch(`/chat/${chatId}/read`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 