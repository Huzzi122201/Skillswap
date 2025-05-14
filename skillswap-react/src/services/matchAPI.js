import api from './api';

export const matchAPI = {
  // Get all matches for current user
  getUserMatches: async () => {
    try {
      const response = await api.get('/matches');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get match by ID
  getMatchById: async (matchId) => {
    try {
      const response = await api.get(`/matches/${matchId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new match request
  createMatch: async (matchData) => {
    try {
      const response = await api.post('/matches', matchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update match status
  updateMatchStatus: async (matchId, status) => {
    try {
      const response = await api.put(`/matches/${matchId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add message to match
  addMessage: async (matchId, message) => {
    try {
      const response = await api.post(`/matches/${matchId}/messages`, { message });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get messages for a match
  getMatchMessages: async (matchId) => {
    try {
      const response = await api.get(`/matches/${matchId}/messages`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Find potential matches based on skills
  findPotentialMatches: async () => {
    try {
      const response = await api.get('/matches/potential');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update match schedule
  updateSchedule: async (matchId, schedule) => {
    try {
      const response = await api.put(`/matches/${matchId}/schedule`, { schedule });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel a match
  cancelMatch: async (matchId) => {
    try {
      await api.delete(`/matches/${matchId}`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 