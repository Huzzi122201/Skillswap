const Swap = require('../models/Swap');
const User = require('../models/User');
const { transporter } = require('../config/emailConfig');

// Create a new swap request
exports.createSwap = async (req, res) => {
    try {
        const swap = new Swap({
            ...req.body,
            requester: req.user._id,
            status: 'pending'
        });

        await swap.save();
        await swap.populate([
            { path: 'requester', select: 'username email' },
            { path: 'provider', select: 'username email' },
            { path: 'requestedSkill', select: 'name' },
            { path: 'offeredSkill', select: 'name' }
        ]);

        // Send email notification to provider
        const mailOptions = {
            to: swap.provider.email,
            from: `"SkillSwap Support" <${process.env.EMAIL_USER}>`,
            subject: 'New Skill Swap Request',
            text: `${swap.requester.username} has requested to swap their ${swap.offeredSkill.name} skill for your ${swap.requestedSkill.name} skill. Please log in to respond to this request.`
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json(swap);
    } catch (error) {
        res.status(400).json({ message: 'Error creating swap request', error: error.message });
    }
};

// Get all swaps for a user (as either requester or provider)
exports.getSwaps = async (req, res) => {
    try {
        const swaps = await Swap.find({
            $or: [
                { requester: req.user._id },
                { provider: req.user._id }
            ]
        })
        .populate('requester', 'username profilePicture')
        .populate('provider', 'username profilePicture')
        .populate('requestedSkill', 'name description')
        .populate('offeredSkill', 'name description')
        .sort({ createdAt: -1 });

        res.json(swaps);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching swaps', error: error.message });
    }
};

// Get a specific swap
exports.getSwap = async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id)
            .populate('requester', 'username profilePicture email')
            .populate('provider', 'username profilePicture email')
            .populate('requestedSkill', 'name description category')
            .populate('offeredSkill', 'name description category');

        if (!swap) {
            return res.status(404).json({ message: 'Swap not found' });
        }

        // Check if user is part of the swap
        if (swap.requester._id.toString() !== req.user._id.toString() && 
            swap.provider._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(swap);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching swap', error: error.message });
    }
};

// Update swap status
exports.updateSwapStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const swap = await Swap.findById(req.params.id)
            .populate('requester', 'username email')
            .populate('provider', 'username email')
            .populate('requestedSkill', 'name')
            .populate('offeredSkill', 'name');

        if (!swap) {
            return res.status(404).json({ message: 'Swap not found' });
        }

        // Check if user is the provider
        if (swap.provider._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        swap.status = status;
        await swap.save();

        // Send email notification to requester
        const mailOptions = {
            to: swap.requester.email,
            from: process.env.EMAIL_USER,
            subject: `Skill Swap Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            text: `Your request to swap ${swap.offeredSkill.name} for ${swap.requestedSkill.name} has been ${status} by ${swap.provider.username}.`
        };

        await transporter.sendMail(mailOptions);
        res.json(swap);
    } catch (error) {
        res.status(400).json({ message: 'Error updating swap status', error: error.message });
    }
};

// Add message to swap
exports.addMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const swap = await Swap.findById(req.params.id)
            .populate('requester', 'username email')
            .populate('provider', 'username email');

        if (!swap) {
            return res.status(404).json({ message: 'Swap not found' });
        }

        // Check if user is part of the swap
        if (swap.requester._id.toString() !== req.user._id.toString() && 
            swap.provider._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        swap.messages.push({
            sender: req.user._id,
            content
        });

        await swap.save();

        // Send email notification to the other party
        const recipient = swap.requester._id.toString() === req.user._id.toString() 
            ? swap.provider 
            : swap.requester;

        const mailOptions = {
            to: recipient.email,
            from: process.env.EMAIL_USER,
            subject: 'New Message in Skill Swap',
            text: `${req.user.username} has sent you a new message regarding your skill swap. Please log in to view and respond.`
        };

        await transporter.sendMail(mailOptions);
        res.json(swap);
    } catch (error) {
        res.status(400).json({ message: 'Error adding message', error: error.message });
    }
};

// Mark swap as completed
exports.completeSwap = async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id);

        if (!swap) {
            return res.status(404).json({ message: 'Swap not found' });
        }

        // Check if user is part of the swap
        if (swap.requester.toString() !== req.user._id.toString() && 
            swap.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update completion status based on user role
        if (swap.requester.toString() === req.user._id.toString()) {
            swap.completionStatus.requesterCompleted = true;
        } else {
            swap.completionStatus.providerCompleted = true;
        }

        // If both parties have marked as complete, update status
        if (swap.completionStatus.requesterCompleted && swap.completionStatus.providerCompleted) {
            swap.status = 'completed';
        }

        await swap.save();
        res.json(swap);
    } catch (error) {
        res.status(400).json({ message: 'Error completing swap', error: error.message });
    }
}; 