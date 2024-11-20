const config = require('../utils/config');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header is present and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the authorization header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, config.JWT_SECRET);

            // Fetch the user based on the ID from the token
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Proceed to the next middleware
            next();
        } catch (error) {
            logger.error(`JWT Error: ${error.message}`);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        // If no token is provided
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        const isAuthorized = roles.includes(req.user.role);
        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        next();
    };
}

module.exports = { protect, authorize };
