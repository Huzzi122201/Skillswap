import { api } from './api';

export const dashboardService = {
    getDashboardData: async () => {
        try {
            const response = await api.get('/dashboard');
            return response.data;
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            throw error.response?.data || error.message;
        }
    },

    getEnrolledCourses: async () => {
        try {
            const response = await api.get('/dashboard/courses');
            return response.data;
        } catch (error) {
            console.error('Enrolled courses fetch error:', error);
            throw error.response?.data || error.message;
        }
    },

    getAchievements: async () => {
        try {
            const response = await api.get('/dashboard/achievements');
            return response.data;
        } catch (error) {
            console.error('Achievements fetch error:', error);
            throw error.response?.data || error.message;
        }
    },

    getRecentActivity: async () => {
        try {
            const response = await api.get('/dashboard/activity');
            return response.data;
        } catch (error) {
            console.error('Recent activity fetch error:', error);
            throw error.response?.data || error.message;
        }
    }
}; 