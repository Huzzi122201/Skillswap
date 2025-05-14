import { api } from './api';

export const profileService = {
    getProfile: async () => {
        try {
            const response = await api.get('/profile');
            return response.data;
        } catch (error) {
            console.error('Profile fetch error:', error);
            throw error.response?.data || error.message;
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/profile', profileData);
            return response.data;
        } catch (error) {
            console.error('Profile update error:', error);
            throw error.response?.data || error.message;
        }
    },

    addSkill: async (type, skillData) => {
        try {
            const response = await api.post(`/profile/skills/${type}`, skillData);
            return response.data;
        } catch (error) {
            console.error('Add skill error:', error);
            throw error.response?.data || error.message;
        }
    },

    updateSkill: async (type, skillId, skillData) => {
        try {
            const response = await api.put(`/profile/skills/${type}/${skillId}`, skillData);
            return response.data;
        } catch (error) {
            console.error('Update skill error:', error);
            throw error.response?.data || error.message;
        }
    },

    deleteSkill: async (type, skillId) => {
        try {
            const response = await api.delete(`/profile/skills/${type}/${skillId}`);
            return response.data;
        } catch (error) {
            console.error('Delete skill error:', error);
            throw error.response?.data || error.message;
        }
    },

    addCertification: async (certData) => {
        try {
            const response = await api.post('/profile/certifications', certData);
            return response.data;
        } catch (error) {
            console.error('Add certification error:', error);
            throw error.response?.data || error.message;
        }
    },

    updateCertification: async (certId, certData) => {
        try {
            const response = await api.put(`/profile/certifications/${certId}`, certData);
            return response.data;
        } catch (error) {
            console.error('Update certification error:', error);
            throw error.response?.data || error.message;
        }
    },

    deleteCertification: async (certId) => {
        try {
            const response = await api.delete(`/profile/certifications/${certId}`);
            return response.data;
        } catch (error) {
            console.error('Delete certification error:', error);
            throw error.response?.data || error.message;
        }
    }
}; 