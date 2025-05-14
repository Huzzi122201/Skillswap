const User = require('../models/User');
const Skill = require('../models/Skill');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'possessedSkills.skill',
                model: 'Skill',
                select: 'name description category'
            })
            .populate({
                path: 'requiredSkills.skill',
                model: 'Skill',
                select: 'name description category'
            })
            .select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Transform the data to match frontend expectations
        const profileData = {
            username: user.username,
            name: user.name || '',
            email: user.email,
            title: user.title || '',
            bio: user.bio || '',
            location: user.location || '',
            avatar: user.avatar || '',
            joinDate: user.joinDate || user.createdAt,
            lastActive: user.lastActive || new Date(),
            possessedSkills: user.possessedSkills.map(skill => ({
                _id: skill._id,
                skillId: skill.skill?._id,
                name: skill.name,
                proficiencyLevel: skill.proficiencyLevel,
                yearsOfExperience: skill.yearsOfExperience,
                description: skill.skill?.description || '',
                category: skill.skill?.category || 'Other'
            })),
            requiredSkills: user.requiredSkills.map(skill => ({
                _id: skill._id,
                skillId: skill.skill?._id,
                name: skill.name,
                desiredLevel: skill.desiredLevel,
                preferredLearningMethod: skill.preferredLearningMethod,
                description: skill.skill?.description || '',
                category: skill.skill?.category || 'Other'
            })),
            rating: user.rating || 0,
            reviews: user.reviews || [],
            certifications: user.certifications || [],
            preferences: user.preferences || {
                emailNotifications: true,
                pushNotifications: true,
                language: 'en',
                theme: 'light'
            }
        };

        res.json(profileData);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ 
            message: 'Error fetching profile', 
            error: error.message 
        });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const {
            name,
            title,
            bio,
            location,
            possessedSkills,
            requiredSkills,
            preferences
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update basic info
        if (name) user.name = name;
        if (title) user.title = title;
        if (bio) user.bio = bio;
        if (location) user.location = location;

        // Update skills if provided
        if (possessedSkills) {
            user.possessedSkills = possessedSkills;
        }
        if (requiredSkills) {
            user.requiredSkills = requiredSkills;
        }

        // Update preferences if provided
        if (preferences) {
            user.preferences = {
                ...user.preferences,
                ...preferences
            };
        }

        // Update lastActive
        user.lastActive = new Date();

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            profile: {
                name: user.name,
                email: user.email,
                title: user.title,
                bio: user.bio,
                location: user.location,
                possessedSkills: user.possessedSkills,
                requiredSkills: user.requiredSkills,
                preferences: user.preferences
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ 
            message: 'Error updating profile', 
            error: error.message 
        });
    }
};

// Add skill
exports.addSkill = async (req, res) => {
    try {
        const { type } = req.params; // 'possessed' or 'required'
        const skillData = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // First, create or find the skill in the Skill collection
        let skill = await Skill.findOne({ name: skillData.name });
        if (!skill) {
            skill = new Skill({
                name: skillData.name,
                category: skillData.category || 'Other',
                description: skillData.description || '',
                proficiencyLevel: type === 'possessed' ? skillData.proficiencyLevel : 'Beginner',
                user: req.user._id
            });
            await skill.save();
        }

        // Create the skill reference object with both reference and name
        const skillRef = {
            skill: skill._id,
            name: skillData.name // Store name directly in the reference
        };

        if (type === 'possessed') {
            skillRef.proficiencyLevel = skillData.proficiencyLevel;
            skillRef.yearsOfExperience = skillData.yearsOfExperience;
            skillRef.availability = skillData.availability || [];
            user.possessedSkills.push(skillRef);
        } else if (type === 'required') {
            skillRef.desiredLevel = skillData.desiredLevel;
            skillRef.preferredLearningMethod = skillData.preferredLearningMethod;
            user.requiredSkills.push(skillRef);
        } else {
            return res.status(400).json({ message: 'Invalid skill type' });
        }

        await user.save();

        // Populate the skills before sending response
        await user.populate([
            {
                path: 'possessedSkills.skill',
                select: 'name description category'
            },
            {
                path: 'requiredSkills.skill',
                select: 'name description category'
            }
        ]);

        // Safely map the skills with null checks
        const response = {
            message: 'Skill added successfully',
            profile: {
                possessedSkills: user.possessedSkills.map(s => ({
                    _id: s._id,
                    skillId: s.skill?._id || null,
                    name: s.name, // Use the directly stored name
                    proficiencyLevel: s.proficiencyLevel || 'Beginner',
                    yearsOfExperience: s.yearsOfExperience || 0,
                    description: s.skill?.description || '',
                    category: s.skill?.category || 'Other'
                })),
                requiredSkills: user.requiredSkills.map(s => ({
                    _id: s._id,
                    skillId: s.skill?._id || null,
                    name: s.name, // Use the directly stored name
                    desiredLevel: s.desiredLevel || 'Beginner',
                    preferredLearningMethod: s.preferredLearningMethod || 'Online',
                    description: s.skill?.description || '',
                    category: s.skill?.category || 'Other'
                }))
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Add skill error:', error);
        res.status(500).json({ 
            message: 'Error adding skill', 
            error: error.message 
        });
    }
};

// Update skill
exports.updateSkill = async (req, res) => {
    try {
        const { type, skillId } = req.params;
        const updates = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const skillsArray = type === 'possessed' ? user.possessedSkills : user.requiredSkills;
        const skillIndex = skillsArray.findIndex(s => s._id.toString() === skillId);

        if (skillIndex === -1) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Update the skill reference
        if (type === 'possessed') {
            if (updates.proficiencyLevel) {
                skillsArray[skillIndex].proficiencyLevel = updates.proficiencyLevel;
            }
            if (updates.yearsOfExperience) {
                skillsArray[skillIndex].yearsOfExperience = updates.yearsOfExperience;
            }
            if (updates.availability) {
                skillsArray[skillIndex].availability = updates.availability;
            }
        } else {
            if (updates.desiredLevel) {
                skillsArray[skillIndex].desiredLevel = updates.desiredLevel;
            }
            if (updates.preferredLearningMethod) {
                skillsArray[skillIndex].preferredLearningMethod = updates.preferredLearningMethod;
            }
        }

        // If there's a name update, update or create the Skill document
        if (updates.name) {
            let skill = await Skill.findOne({ name: updates.name });
            if (!skill) {
                skill = new Skill({
                    name: updates.name,
                    category: updates.category || 'Other',
                    description: updates.description || '',
                    user: req.user._id
                });
                await skill.save();
            }
            skillsArray[skillIndex].skill = skill._id;
        }

        await user.save();

        // Populate the skills before sending response
        await user.populate([
            {
                path: 'possessedSkills.skill',
                select: 'name description category'
            },
            {
                path: 'requiredSkills.skill',
                select: 'name description category'
            }
        ]);

        res.json({
            message: 'Skill updated successfully',
            profile: {
                possessedSkills: user.possessedSkills.map(s => ({
                    _id: s._id,
                    skillId: s.skill._id,
                    name: s.skill.name,
                    proficiencyLevel: s.proficiencyLevel,
                    yearsOfExperience: s.yearsOfExperience,
                    description: s.skill.description,
                    category: s.skill.category
                })),
                requiredSkills: user.requiredSkills.map(s => ({
                    _id: s._id,
                    skillId: s.skill._id,
                    name: s.skill.name,
                    desiredLevel: s.desiredLevel,
                    preferredLearningMethod: s.preferredLearningMethod,
                    description: s.skill.description,
                    category: s.skill.category
                }))
            }
        });
    } catch (error) {
        console.error('Update skill error:', error);
        res.status(500).json({ 
            message: 'Error updating skill', 
            error: error.message 
        });
    }
};

// Add certification
exports.addCertification = async (req, res) => {
    try {
        const certData = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.certifications.push(certData);
        await user.save();

        res.json({
            message: 'Certification added successfully',
            certifications: user.certifications
        });
    } catch (error) {
        console.error('Add certification error:', error);
        res.status(500).json({ 
            message: 'Error adding certification', 
            error: error.message 
        });
    }
};

// Update certification
exports.updateCertification = async (req, res) => {
    try {
        const { certId } = req.params;
        const updates = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const certIndex = user.certifications.findIndex(c => c._id.toString() === certId);
        if (certIndex === -1) {
            return res.status(404).json({ message: 'Certification not found' });
        }

        Object.assign(user.certifications[certIndex], updates);
        await user.save();

        res.json({
            message: 'Certification updated successfully',
            certifications: user.certifications
        });
    } catch (error) {
        console.error('Update certification error:', error);
        res.status(500).json({ 
            message: 'Error updating certification', 
            error: error.message 
        });
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        const { type, skillId } = req.params;
        const user = await User.findById(req.user._id);
        
        const skillsArray = type === 'possessed' ? 'possessedSkills' : 'requiredSkills';
        user[skillsArray] = user[skillsArray].filter(s => s._id.toString() !== skillId);

        await user.save();
        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting skill', 
            error: error.message 
        });
    }
};

exports.deleteCertification = async (req, res) => {
    try {
        const { certId } = req.params;
        const user = await User.findById(req.user._id);
        
        user.certifications = user.certifications.filter(c => c._id.toString() !== certId);
        await user.save();
        res.json({ message: 'Certification deleted successfully' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting certification', 
            error: error.message 
        });
    }
}; 