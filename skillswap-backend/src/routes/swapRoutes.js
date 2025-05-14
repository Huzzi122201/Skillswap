const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create a new swap request
router.post('/', swapController.createSwap);

// Get all swaps for the authenticated user
router.get('/', swapController.getSwaps);

// Get a specific swap
router.get('/:id', swapController.getSwap);

// Update swap status (accept/reject)
router.patch('/:id/status', swapController.updateSwapStatus);

// Add message to swap
router.post('/:id/messages', swapController.addMessage);

// Mark swap as completed
router.patch('/:id/complete', swapController.completeSwap);

module.exports = router; 