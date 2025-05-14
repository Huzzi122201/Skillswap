const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const Match = require('../models/Match');

// Get all reviews for current user (either as reviewer or receiver)
router.get('/my-reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.find({
      $or: [
        { reviewerId: req.user._id },
        { receiverId: req.user._id }
      ]
    })
    .populate('reviewerId', 'name avatar')
    .populate('receiverId', 'name avatar')
    .populate('matchId', 'skillToTeach skillToLearn')
    .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Create a new review
router.post('/', auth, async (req, res) => {
  try {
    const { matchId, rating, feedback, skillTaught } = req.body;

    // Get the match to determine the receiver
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Determine receiverId based on the match and reviewer
    const receiverId = match.teacherId.toString() === req.user._id.toString() 
      ? match.learnerId 
      : match.teacherId;

    // Create new review
    const review = new Review({
      reviewerId: req.user._id,
      receiverId,
      matchId,
      rating,
      feedback,
      skillTaught: skillTaught || match.skillToTeach // Use provided skillTaught or default to match's skillToTeach
    });

    // Save review
    const savedReview = await review.save();

    // Populate review data
    const populatedReview = await savedReview
      .populate('reviewerId', 'name avatar')
      .populate('receiverId', 'name avatar')
      .populate('matchId', 'skillToTeach skillToLearn');

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({ message: 'Error creating review' });
  }
});

// Get reviews for a specific match
router.get('/match/:matchId', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ matchId: req.params.matchId })
      .populate('reviewerId', 'name avatar')
      .populate('receiverId', 'name avatar')
      .populate('matchId', 'skillToTeach skillToLearn')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching match reviews:', error);
    res.status(500).json({ message: 'Error fetching match reviews' });
  }
});

// Update a review
router.patch('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.reviewerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // Update allowed fields
    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.feedback) review.feedback = req.body.feedback;

    const updatedReview = await review.save();
    const populatedReview = await updatedReview
      .populate('reviewerId', 'name avatar')
      .populate('receiverId', 'name avatar')
      .populate('matchId', 'skillToTeach skillToLearn');

    res.json(populatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(400).json({ message: 'Error updating review' });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.reviewerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.deleteOne({ _id: review._id });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

module.exports = router; 