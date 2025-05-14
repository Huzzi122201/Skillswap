const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestedSkill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    offeredSkill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    proposedSchedule: {
        startDate: Date,
        endDate: Date,
        frequency: String,
        timeSlots: [{
            day: String,
            startTime: String,
            endTime: String
        }]
    },
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    completionStatus: {
        requesterCompleted: {
            type: Boolean,
            default: false
        },
        providerCompleted: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

const Swap = mongoose.model('Swap', swapSchema);
module.exports = Swap; 