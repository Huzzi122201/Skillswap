const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const auth = require('../middleware/auth');

// Protected routes (require authentication)
router.use(auth);

// Create a new skill
router.post('/', skillController.createSkill);

// Get all skills (with optional filters)
router.get('/', skillController.getSkills);

// Get a specific skill
router.get('/:id', skillController.getSkill);

// Update a skill
router.put('/:id', skillController.updateSkill);

// Delete a skill
router.delete('/:id', skillController.deleteSkill);

// Get user's skills
router.get('/user/:userId', skillController.getUserSkills);

module.exports = router; 