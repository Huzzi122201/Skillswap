import { api } from './api';

export const matchService = {
    getTeachingMatches: async () => {
        try {
            const response = await api.get('/matches/teaching');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getLearningMatches: async () => {
        try {
            const response = await api.get('/matches/learning');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    createMatch: async (matchData) => {
        try {
            const response = await api.post('/matches', matchData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateMatchStatus: async (matchId, status) => {
        try {
            const response = await api.put(`/matches/${matchId}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getMatchById: async (matchId) => {
        try {
            const response = await api.get(`/matches/${matchId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    addReview: async (matchId, reviewData) => {
        try {
            const response = await api.post(`/matches/${matchId}/reviews`, reviewData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getReviews: async (userId) => {
        try {
            const response = await api.get(`/users/${userId}/reviews`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    addMessage: async (matchId, content) => {
        try {
            const response = await api.post(`/matches/${matchId}/messages`, { content });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getMessages: async (matchId) => {
        try {
            const response = await api.get(`/matches/${matchId}/messages`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateSchedule: async (matchId, schedule) => {
        try {
            const response = await api.put(`/matches/${matchId}/schedule`, { schedule });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    findPotentialMatches: async () => {
        try {
            const response = await api.get('/matches/potential');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    cancelMatch: async (matchId) => {
        try {
            await api.delete(`/matches/${matchId}`);
            return true;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 