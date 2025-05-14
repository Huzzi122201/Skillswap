const api = require('./api');

const courseService = {
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  getEnrolledCourses: async () => {
    const response = await api.get('/courses/enrolled');
    return response.data;
  },

  enrollInCourse: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  updateCourseProgress: async (courseId, progress) => {
    const response = await api.put(`/courses/${courseId}/progress`, { progress });
    return response.data;
  },

  getCoursesByCategory: async (category) => {
    const response = await api.get(`/courses/category/${category}`);
    return response.data;
  }
};

module.exports = courseService; 