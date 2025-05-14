const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Technology', 'Language', 'Music', 'Art', 'Sports', 'Cooking', 'Business', 'Academic', 'Other']
    },
    description: {
        type: String,
        required: true
    },
    proficiencyLevel: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    availability: {
        type: [{
            day: String,
            startTime: String,
            endTime: String
        }],
        default: []
    },
    teachingMethod: {
        type: String,
        enum: ['Online', 'In-person', 'Both'],
        default: 'Online'
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill; 