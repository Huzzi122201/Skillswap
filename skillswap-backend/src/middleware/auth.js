const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Use exact JWT secret from .env
const JWT_SECRET = process.env.JWT_SECRET || 'huzaifa121@';

const auth = async (req, res, next) => {
    console.log('========== Auth Middleware ==========');
    console.log('Request path:', req.path);
    console.log('Request method:', req.method);
    console.log('Headers:', req.headers);
    
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'No token');
        
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        try {
            // Verify token
            console.log('Attempting to verify token with secret:', JWT_SECRET.substring(0, 3) + '...');
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log('Token decoded successfully:', decoded);
            
            // Find user
            console.log('Looking up user with ID:', decoded.userId);
            const user = await User.findById(decoded.userId);
            
            if (!user) {
                console.log('User not found in database');
                return res.status(401).json({ message: 'User not found' });
            }

            console.log('User found:', user._id);
            // Add user to request
            req.user = user;
            next();
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Server error during authentication' });
    }
};

module.exports = auth; 