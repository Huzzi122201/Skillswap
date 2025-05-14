const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const auth = require('../middleware/auth');

// Get all posts with filters and pagination
router.get('/posts', auth, communityController.getPosts);

// Create a new post
router.post('/posts', auth, communityController.createPost);

// Get a single post
router.get('/posts/:id', auth, communityController.getPost);

// Update a post
router.put('/posts/:id', auth, communityController.updatePost);

// Delete a post
router.delete('/posts/:id', auth, communityController.deletePost);

// Add a comment to a post
router.post('/posts/:id/comments', auth, communityController.addComment);

// Toggle like on a post
router.post('/posts/:id/like', auth, communityController.toggleLike);

module.exports = router; 