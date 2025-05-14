const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Programming', 'Design', 'Business', 'Marketing', 'Language', 'Music', 'Art', 'Other']
    },
    description: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    badge: {
        type: String,
        enum: ['Featured Creator', 'Community Favorite', 'Rising Star', 'Top Rated', null],
        default: null
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    students: {
        type: Number,
        default: 0
    },
    totalStudents: {
        type: Number,
        default: 0
    },
    topics: [{
        type: String
    }],
    duration: {
        type: Number, // in minutes
        required: true
    },
    schedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        time: String
    }],
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Virtual for average rating
courseSchema.virtual('averageRating').get(function() {
    return this.rating.count > 0 ? this.rating.average : 0;
});

// Method to update course rating
courseSchema.methods.updateRating = async function() {
    if (this.reviews.length === 0) {
        this.rating.average = 0;
        this.rating.count = 0;
    } else {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.rating.average = totalRating / this.reviews.length;
        this.rating.count = this.reviews.length;
    }
    await this.save();
};

const Course = mongoose.model('Course', courseSchema);
module.exports = Course; 