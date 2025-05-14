const User = require('../models/User');
const Settings = require('../models/Settings');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('possessedSkills.skill')
      .populate('requiredSkills.skill')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, title, bio, location } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (title) user.title = title;
    if (bio) user.bio = bio;
    if (location) user.location = location;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get user settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.params.userId });
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        user: req.params.userId,
        notifications: {
          emailUpdates: true,
          courseReminders: true,
          newMessages: true,
          marketingEmails: false
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          showLocation: true,
          allowMessaging: true
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: '30',
          loginAlerts: true
        }
      });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

// Update user settings
exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { user: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('enrolledCourses.course')
      .populate('achievements');

    const stats = {
      coursesInProgress: user.enrolledCourses.filter(c => !c.completed).length,
      completedCourses: user.enrolledCourses.filter(c => c.completed).length,
      hoursLearned: user.enrolledCourses.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0),
      achievementPoints: user.achievements?.reduce((acc, curr) => acc + curr.points, 0) || 0,
      recentCourses: user.enrolledCourses
        .sort((a, b) => b.lastAccessed - a.lastAccessed)
        .slice(0, 4)
        .map(c => ({
          id: c.course._id,
          title: c.course.title,
          progress: c.progress,
          image: c.course.image,
          instructor: c.course.instructor
        })),
      recentAchievements: (user.achievements || [])
        .sort((a, b) => b.dateEarned - a.dateEarned)
        .slice(0, 3)
        .map(a => ({
          id: a._id,
          title: a.title,
          description: a.description,
          icon: a.icon
        }))
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Add possessed skill
exports.addPossessedSkill = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.possessedSkills.push(req.body);
    await user.save();
    res.status(201).json(user.possessedSkills[user.possessedSkills.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding skill', error: error.message });
  }
};

// Update possessed skill
exports.updatePossessedSkill = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const skillIndex = user.possessedSkills.findIndex(s => s._id.toString() === req.params.skillId);
    
    if (skillIndex === -1) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    user.possessedSkills[skillIndex] = { ...user.possessedSkills[skillIndex], ...req.body };
    await user.save();
    res.json(user.possessedSkills[skillIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating skill', error: error.message });
  }
};

// Delete possessed skill
exports.deletePossessedSkill = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.possessedSkills = user.possessedSkills.filter(s => s._id.toString() !== req.params.skillId);
    await user.save();
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill', error: error.message });
  }
};

// Add required skill
exports.addRequiredSkill = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.requiredSkills.push(req.body);
    await user.save();
    res.status(201).json(user.requiredSkills[user.requiredSkills.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding skill', error: error.message });
  }
};

// Update required skill
exports.updateRequiredSkill = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const skillIndex = user.requiredSkills.findIndex(s => s._id.toString() === req.params.skillId);
    
    if (skillIndex === -1) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    user.requiredSkills[skillIndex] = { ...user.requiredSkills[skillIndex], ...req.body };
    await user.save();
    res.json(user.requiredSkills[skillIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating skill', error: error.message });
  }
};

// Delete required skill
exports.deleteRequiredSkill = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.requiredSkills = user.requiredSkills.filter(s => s._id.toString() !== req.params.skillId);
    await user.save();
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill', error: error.message });
  }
}; 