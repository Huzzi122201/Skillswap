const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

// All profile routes require authentication
router.use(auth);

// Get user profile
router.get('/', profileController.getProfile);

// Update user profile
router.put('/', profileController.updateProfile);

// Skills routes
router.post('/skills/:type', profileController.addSkill);
router.put('/skills/:type/:skillId', profileController.updateSkill);
router.delete('/skills/:type/:skillId', profileController.deleteSkill);

// Certification routes
router.post('/certifications', profileController.addCertification);
router.put('/certifications/:certId', profileController.updateCertification);
router.delete('/certifications/:certId', profileController.deleteCertification);

module.exports = router; 