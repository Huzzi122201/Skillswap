const api = require('./api');

const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  addSkill: async (skillData) => {
    const response = await api.post('/users/skills', skillData);
    return response.data;
  },

  removeSkill: async (skillId) => {
    const response = await api.delete(`/users/skills/${skillId}`);
    return response.data;
  },

  addCertification: async (certData) => {
    const response = await api.post('/users/certifications', certData);
    return response.data;
  },

  removeCertification: async (certId) => {
    const response = await api.delete(`/users/certifications/${certId}`);
    return response.data;
  },

  getAchievements: async () => {
    const response = await api.get('/users/achievements');
    return response.data;
  }
};

module.exports = userService; 