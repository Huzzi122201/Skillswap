const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendResetEmail } = require('../config/emailConfig');

// Use exact JWT secret from .env
const JWT_SECRET = process.env.JWT_SECRET || 'huzaifa121@';

const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
    try {
        const { 
            username, 
            email, 
            password,
            possessedSkills, // Array of skills user can teach
            requiredSkills  // Array of skills user wants to learn
        } = req.body;

        console.log('Registration attempt:', { username, email, possessedSkills, requiredSkills });

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                details: {
                    username: !username ? 'Username is required' : null,
                    email: !email ? 'Email is required' : null,
                    password: !password ? 'Password is required' : null
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists',
                details: {
                    email: existingUser.email === email ? 'Email already in use' : null,
                    username: existingUser.username === username ? 'Username already taken' : null
                }
            });
        }

        // Format possessed skills
        const formattedPossessedSkills = possessedSkills?.map(skill => ({
            name: skill.name,
            proficiencyLevel: skill.proficiencyLevel,
            yearsOfExperience: skill.yearsOfExperience
        })) || [];

        // Format required skills
        const formattedRequiredSkills = requiredSkills?.map(skill => ({
            name: skill.name,
            desiredLevel: skill.desiredLevel,
            preferredLearningMethod: skill.preferredLearningMethod
        })) || [];

        // Create new user with formatted skills
        const user = new User({
            username,
            email,
            password,
            possessedSkills: formattedPossessedSkills,
            requiredSkills: formattedRequiredSkills
        });

        try {
            await user.save();
            console.log('User saved successfully:', user._id);

            // Create default dashboard for the new user
            const Dashboard = require('../models/Dashboard');
            const defaultDashboard = new Dashboard({
                user: user._id,
                enrolledCourses: [],
                achievements: [],
                stats: {
                    totalHoursLearned: 0,
                    achievementPoints: 0
                },
                recentActivity: []
            });

            await defaultDashboard.save();
            console.log('Default dashboard created for user:', user._id);
            
            // Generate token
            const token = generateToken(user._id);

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    possessedSkills: user.possessedSkills,
                    requiredSkills: user.requiredSkills
                }
            });
        } catch (saveError) {
            console.error('Error saving user or creating dashboard:', saveError);
            return res.status(500).json({ 
                message: 'Error saving user to database',
                error: process.env.NODE_ENV === 'development' ? saveError.message : 'Internal server error'
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Error registering user', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        // Don't reveal if user exists or not for security
        if (!user) {
            return res.json({ 
                message: 'If an account exists with this email, you will receive password reset instructions.' 
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        try {
            await sendResetEmail(email, resetToken);
            res.json({ 
                message: 'If an account exists with this email, you will receive password reset instructions.' 
            });
        } catch (emailError) {
            // Reset the token if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            
            return res.status(500).json({ 
                message: 'Error sending reset email. Please try again later.',
                error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
            });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Error processing password reset request', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};

// Add profile update endpoint
exports.updateProfile = async (req, res) => {
    try {
        const {
            username,
            bio,
            possessedSkills,
            requiredSkills
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update basic info
        if (username) user.username = username;
        if (bio) user.bio = bio;

        // Update possessed skills
        if (possessedSkills) {
            user.possessedSkills = possessedSkills.map(skill => ({
                skill: skill.skillId,
                proficiencyLevel: skill.proficiencyLevel,
                yearsOfExperience: skill.yearsOfExperience,
                availability: skill.availability
            }));
        }

        // Update required skills
        if (requiredSkills) {
            user.requiredSkills = requiredSkills.map(skill => ({
                skill: skill.skillId,
                desiredLevel: skill.desiredLevel,
                preferredLearningMethod: skill.preferredLearningMethod
            }));
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                possessedSkills: user.possessedSkills,
                requiredSkills: user.requiredSkills
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('possessedSkills.skill')
            .populate('requiredSkills.skill');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture,
                possessedSkills: user.possessedSkills,
                requiredSkills: user.requiredSkills,
                rating: user.rating,
                reviews: user.reviews
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

// Add logout endpoint
exports.logout = async (req, res) => {
    try {
        // Get the token from the request header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        // Add token to blacklist or invalidate it
        // You might want to store invalidated tokens in Redis or a database
        // For now, we'll just send a success response
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error during logout' });
    }
}; 