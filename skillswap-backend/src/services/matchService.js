const api = require('./api');

const matchService = {
  getTeachingMatches: async () => {
    const response = await api.get('/matches/teaching');
    return response.data;
  },

  getLearningMatches: async () => {
    const response = await api.get('/matches/learning');
    return response.data;
  },

  createMatch: async (matchData) => {
    const response = await api.post('/matches', matchData);
    return response.data;
  },

  updateMatchStatus: async (matchId, status) => {
    const response = await api.put(`/matches/${matchId}/status`, { status });
    return response.data;
  },

  getMatchById: async (matchId) => {
    const response = await api.get(`/matches/${matchId}`);
    return response.data;
  },

  addReview: async (matchId, reviewData) => {
    const response = await api.post(`/matches/${matchId}/reviews`, reviewData);
    return response.data;
  },

  getReviews: async (userId) => {
    const response = await api.get(`/users/${userId}/reviews`);
    return response.data;
  }
};

module.exports = matchService; 