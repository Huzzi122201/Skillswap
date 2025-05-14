const Skill = require('../models/Skill');

// Create a new skill
exports.createSkill = async (req, res) => {
    try {
        const skill = new Skill({
            ...req.body,
            user: req.user._id
        });
        await skill.save();
        res.status(201).json(skill);
    } catch (error) {
        res.status(400).json({ message: 'Error creating skill', error: error.message });
    }
};

// Get all skills (with filters)
exports.getSkills = async (req, res) => {
    try {
        const { category, proficiencyLevel, teachingMethod, search } = req.query;
        const query = {};

        if (category) query.category = category;
        if (proficiencyLevel) query.proficiencyLevel = proficiencyLevel;
        if (teachingMethod) query.teachingMethod = teachingMethod;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skills = await Skill.find(query)
            .populate('user', 'username profilePicture rating')
            .sort({ createdAt: -1 });

        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching skills', error: error.message });
    }
};

// Get a specific skill
exports.getSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id)
            .populate('user', 'username profilePicture rating bio');
        
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        
        res.json(skill);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching skill', error: error.message });
    }
};

// Update a skill
exports.updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });
        
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found or unauthorized' });
        }

        Object.assign(skill, req.body);
        await skill.save();
        
        res.json(skill);
    } catch (error) {
        res.status(400).json({ message: 'Error updating skill', error: error.message });
    }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found or unauthorized' });
        }
        
        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting skill', error: error.message });
    }
};

// Get user's skills
exports.getUserSkills = async (req, res) => {
    try {
        const skills = await Skill.find({ user: req.params.userId })
            .populate('user', 'username profilePicture rating');
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user skills', error: error.message });
    }
}; 