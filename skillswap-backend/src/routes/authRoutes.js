const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Logout route
router.post('/logout', auth, authController.logout);

// Protected routes
router.use(auth);

// Profile management
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);

// Get current user data
router.get('/me', async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                profilePicture: req.user.profilePicture,
                bio: req.user.bio,
                possessedSkills: req.user.possessedSkills,
                requiredSkills: req.user.requiredSkills,
                rating: req.user.rating
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

module.exports = router; 