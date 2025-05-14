import { api } from './api';

export const reviewService = {
    // Get all reviews for current user
    getMyReviews: async () => {
        try {
            const response = await api.get('/reviews/my-reviews');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            throw error.response?.data || { message: 'Failed to fetch reviews' };
        }
    },

    // Create a new review
    createReview: async (reviewData) => {
        try {
            const response = await api.post('/reviews', reviewData);
            return response.data;
        } catch (error) {
            console.error('Failed to create review:', error);
            throw error.response?.data || { message: 'Failed to create review' };
        }
    },

    // Get reviews for a specific match
    getMatchReviews: async (matchId) => {
        try {
            const response = await api.get(`/reviews/match/${matchId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch match reviews:', error);
            throw error.response?.data || { message: 'Failed to fetch match reviews' };
        }
    },

    // Update a review
    updateReview: async (reviewId, updateData) => {
        try {
            const response = await api.patch(`/reviews/${reviewId}`, updateData);
            return response.data;
        } catch (error) {
            console.error('Failed to update review:', error);
            throw error.response?.data || { message: 'Failed to update review' };
        }
    },

    // Delete a review
    deleteReview: async (reviewId) => {
        try {
            const response = await api.delete(`/reviews/${reviewId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete review:', error);
            throw error.response?.data || { message: 'Failed to delete review' };
        }
    }
}; 