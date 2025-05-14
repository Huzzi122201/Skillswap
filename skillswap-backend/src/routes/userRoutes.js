const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// Profile routes
router.get('/:userId/profile', auth, userController.getProfile);
router.put('/:userId/profile', auth, userController.updateProfile);

// Settings routes
router.get('/:userId/settings', auth, userController.getSettings);
router.put('/:userId/settings', auth, userController.updateSettings);

// Dashboard routes
router.get('/:userId/dashboard', auth, userController.getDashboardStats);

// Skills routes
router.post('/:userId/skills/possessed', auth, userController.addPossessedSkill);
router.put('/:userId/skills/possessed/:skillId', auth, userController.updatePossessedSkill);
router.delete('/:userId/skills/possessed/:skillId', auth, userController.deletePossessedSkill);

router.post('/:userId/skills/required', auth, userController.addRequiredSkill);
router.put('/:userId/skills/required/:skillId', auth, userController.updateRequiredSkill);
router.delete('/:userId/skills/required/:skillId', auth, userController.deleteRequiredSkill);

module.exports = router; 