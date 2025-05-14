import { api } from './api';

export const peerReviewService = {
    // Create a new peer review request
    createPeerReview: async (reviewData) => {
        try {
            console.log('Creating peer review with data:', reviewData);
            const response = await api.post('/reviews', reviewData);
            console.log('Peer review created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to create peer review:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error.response?.data || { message: 'Failed to create peer review. Please check your connection and try again.' };
        }
    },

    // Get all peer reviews with optional filters
    getPeerReviews: async (filters = {}) => {
        try {
            console.log('Fetching peer reviews with filters:', filters);
            const response = await api.get('/reviews', { params: filters });
            console.log('Peer reviews fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch peer reviews:', {
                filters,
                error: {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                }
            });
            throw error.response?.data || { message: 'Failed to fetch peer reviews. Please check your connection and try again.' };
        }
    },

    // Get a specific peer review
    getPeerReviewById: async (reviewId) => {
        try {
            console.log('Fetching peer review by ID:', reviewId);
            const response = await api.get(`/peer-reviews/${reviewId}`);
            console.log('Peer review fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch peer review:', {
                reviewId,
                error: {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                }
            });
            throw error.response?.data || { message: 'Failed to fetch peer review. Please check your connection and try again.' };
        }
    },

    // Volunteer as a reviewer
    volunteerAsReviewer: async (reviewId) => {
        try {
            console.log('Volunteering as reviewer for review:', reviewId);
            const response = await api.post(`/peer-reviews/${reviewId}/volunteer`);
            console.log('Volunteered successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to volunteer as reviewer:', {
                reviewId,
                error: {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                }
            });
            throw error.response?.data || { message: 'Failed to volunteer as reviewer. Please try again.' };
        }
    },

    // Submit a review
    submitReview: async (reviewId, reviewData) => {
        try {
            console.log('Submitting review:', { reviewId, reviewData });
            const response = await api.post(`/peer-reviews/${reviewId}/submit`, reviewData);
            console.log('Review submitted successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to submit review:', {
                reviewId,
                error: {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                }
            });
            throw error.response?.data || { message: 'Failed to submit review. Please try again.' };
        }
    }
}; 