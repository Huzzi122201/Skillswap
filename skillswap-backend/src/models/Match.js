const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
});

const matchSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  skillToTeach: {
    type: String,
    required: true
  },
  skillToLearn: {
    type: String,
    required: true
  },
  teacherExperience: {
    years: {
      type: Number,
      required: true
    },
    proficiencyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  learnerGoals: {
    targetLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      required: true
    },
    timeCommitment: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  schedule: [scheduleSchema],
  preferredLocation: {
    type: String,
    enum: ['Online', 'In-person', 'Hybrid'],
    required: true
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String
  }
});

// Update lastActive timestamp on message or status change
matchSchema.pre('save', function(next) {
  if (this.isModified('messages') || this.isModified('status')) {
    this.lastActive = new Date();
  }
  next();
});

module.exports = mongoose.model('Match', matchSchema); 