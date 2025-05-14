import api from './api';

export const courseAPI = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get courses by instructor
  getCoursesByInstructor: async (instructorId) => {
    try {
      const response = await api.get(`/courses/instructor/${instructorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new course
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a course
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await api.put(`/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a course
  deleteCourse: async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get course reviews
  getCourseReviews: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/reviews`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add course review
  addCourseReview: async (courseId, reviewData) => {
    try {
      const response = await api.post(`/courses/${courseId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Enroll in a course
  enrollInCourse: async (courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get enrolled courses for user
  getEnrolledCourses: async () => {
    try {
      const response = await api.get('/courses/enrolled');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCourseProgress: async (courseId, progress) => {
    try {
      const response = await api.put(`/courses/${courseId}/progress`, { progress });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCoursesByCategory: async (category) => {
    try {
      const response = await api.get(`/courses/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 