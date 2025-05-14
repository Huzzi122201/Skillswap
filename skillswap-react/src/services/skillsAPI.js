import { api } from './api';

export const skillsAPI = {
  // Get user's profile with skills
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add a possessed skill
  addPossessedSkill: async (userId, skillData) => {
    try {
      const response = await api.post(`/users/${userId}/skills/possessed`, skillData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add a required skill
  addRequiredSkill: async (userId, skillData) => {
    try {
      const response = await api.post(`/users/${userId}/skills/required`, skillData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a possessed skill
  updatePossessedSkill: async (userId, skillId, skillData) => {
    try {
      const response = await api.put(
        `/users/${userId}/skills/possessed/${skillId}`,
        skillData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a required skill
  updateRequiredSkill: async (userId, skillId, skillData) => {
    try {
      const response = await api.put(
        `/users/${userId}/skills/required/${skillId}`,
        skillData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a possessed skill
  deletePossessedSkill: async (userId, skillId) => {
    try {
      await api.delete(`/users/${userId}/skills/possessed/${skillId}`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a required skill
  deleteRequiredSkill: async (userId, skillId) => {
    try {
      await api.delete(`/users/${userId}/skills/required/${skillId}`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user settings
  getUserSettings: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/settings`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user settings
  updateUserSettings: async (userId, settingsData) => {
    try {
      const response = await api.put(`/users/${userId}/settings`, settingsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get dashboard stats
  getDashboardStats: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/dashboard`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 