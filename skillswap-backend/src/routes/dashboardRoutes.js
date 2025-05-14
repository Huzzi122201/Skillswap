const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// All dashboard routes require authentication
router.use(auth);

// Get dashboard overview data
router.get('/', dashboardController.getDashboardData);

// Get enrolled courses
router.get('/enrolled-courses', dashboardController.getEnrolledCourses);

// Get achievements
router.get('/achievements', dashboardController.getAchievements);

// Get progress data
router.get('/progress', dashboardController.getProgress);

module.exports = router; 