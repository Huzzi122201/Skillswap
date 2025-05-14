const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    enrolledCourses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        courseName: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        instructor: {
            name: String,
            avatar: String
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        completed: {
            type: Boolean,
            default: false
        },
        lastAccessedAt: {
            type: Date,
            default: Date.now
        }
    }],
    achievements: [{
        _id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: String,
        points: {
            type: Number,
            default: 10
        },
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }],
    stats: {
        totalHoursLearned: {
            type: Number,
            default: 0
        },
        achievementPoints: {
            type: Number,
            default: 0
        }
    },
    recentActivity: [{
        type: {
            type: String,
            enum: ['course_progress', 'achievement_earned', 'course_completed', 'quiz_completed', 'achievement_unlocked'],
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        description: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Pre-save middleware to update achievement points
dashboardSchema.pre('save', function(next) {
    if (this.achievements) {
        this.stats.achievementPoints = this.achievements.reduce((total, achievement) => {
            return total + (achievement.points || 10);
        }, 0);
    }
    next();
});

module.exports = mongoose.model('Dashboard', dashboardSchema); 