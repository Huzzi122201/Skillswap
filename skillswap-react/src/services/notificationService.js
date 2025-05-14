import { api } from './api';

export const notificationService = {
    // Get all notifications
    getNotifications: async (page = 1, limit = 20) => {
        try {
            const response = await api.get('/notifications', {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Mark a notification as read
    markAsRead: async (notificationId) => {
        try {
            const response = await api.patch(`/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        try {
            const response = await api.patch('/notifications/read/all');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete a notification
    deleteNotification: async (notificationId) => {
        try {
            const response = await api.delete(`/notifications/${notificationId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete all read notifications
    deleteAllRead: async () => {
        try {
            const response = await api.delete('/notifications/read/all');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get unread notifications count
    getUnreadCount: async () => {
        try {
            const response = await api.get('/notifications/unread/count');
            return response.data.unreadCount;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 