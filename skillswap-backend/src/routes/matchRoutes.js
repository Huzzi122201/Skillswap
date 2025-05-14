const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const auth = require('../middleware/auth');

// Get all matches for current user
router.get('/my-matches', auth, async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [
        { teacherId: req.user._id },
        { learnerId: req.user._id }
      ]
    })
    .populate({
      path: 'teacherId',
      select: 'username profilePicture bio rating'
    })
    .populate({
      path: 'learnerId',
      select: 'username profilePicture bio rating'
    })
    .populate({
      path: 'messages.sender',
      select: 'username profilePicture'
    })
    .sort({ lastActive: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get teaching matches for current user
router.get('/teaching', auth, async (req, res) => {
  try {
    const matches = await Match.find({
      teacherId: req.user._id
    })
    .populate({
      path: 'learnerId',
      select: 'username profilePicture bio rating'
    })
    .populate({
      path: 'messages.sender',
      select: 'username profilePicture'
    })
    .sort({ lastActive: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get learning matches for current user
router.get('/learning', auth, async (req, res) => {
  try {
    const matches = await Match.find({
      learnerId: req.user._id
    })
    .populate({
      path: 'teacherId',
      select: 'username profilePicture bio rating'
    })
    .populate({
      path: 'messages.sender',
      select: 'username profilePicture'
    })
    .sort({ lastActive: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a match request
router.post('/', auth, async (req, res) => {
  try {
    const match = new Match({
      teacherId: req.user._id,
      learnerId: req.body.learnerId,
      skillToTeach: req.body.skillToTeach,
      skillToLearn: req.body.skillToLearn,
      teacherExperience: {
        years: req.body.teacherExperience.years,
        proficiencyLevel: req.body.teacherExperience.proficiencyLevel,
        description: req.body.teacherExperience.description
      },
      learnerGoals: {
        targetLevel: req.body.learnerGoals.targetLevel,
        timeCommitment: req.body.learnerGoals.timeCommitment,
        description: req.body.learnerGoals.description
      },
      schedule: req.body.schedule,
      preferredLocation: req.body.preferredLocation,
      status: 'pending'
    });

    const savedMatch = await match.save();
    res.status(201).json(await savedMatch
      .populate('teacherId', 'name avatar title location rating bio')
      .populate('learnerId', 'name avatar title location rating bio')
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update match status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Only allow learner to update status
    if (match.learnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    match.status = req.body.status;
    
    // If completing the match, add rating and feedback
    if (req.body.status === 'completed') {
      match.rating = req.body.rating;
      match.feedback = req.body.feedback;
    }

    const updatedMatch = await match.save();
    res.json(await updatedMatch
      .populate('teacherId', 'name avatar title location rating bio')
      .populate('learnerId', 'name avatar title location rating bio')
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add message to match
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Only allow participants to send messages
    if (![match.teacherId.toString(), match.learnerId.toString()].includes(req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    match.messages.push({
      sender: req.user._id,
      content: req.body.content
    });

    const updatedMatch = await match.save();
    res.json(await updatedMatch
      .populate('teacherId', 'name avatar title location rating bio')
      .populate('learnerId', 'name avatar title location rating bio')
      .populate('messages.sender', 'name avatar')
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update schedule
router.patch('/:id/schedule', auth, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Only allow participants to update schedule
    if (![match.teacherId.toString(), match.learnerId.toString()].includes(req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    match.schedule = req.body.schedule;
    const updatedMatch = await match.save();
    res.json(await updatedMatch
      .populate('teacherId', 'name avatar title location rating bio')
      .populate('learnerId', 'name avatar title location rating bio')
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 