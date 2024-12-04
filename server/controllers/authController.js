const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    try {
        // check if email or name is already registered
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, email, password, name: email.split('@')[0] });
        const token = generateToken(user._id);
        const userData = user.toObject();
        delete userData.password;

        return res.status(201).json({ token, user: userData, message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    console.log(req.body);
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: 'User is not active' });
        }

        const token = generateToken(user._id);
        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({ token, user: userData, message: `welcome back ${user.name}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        delete user.password;
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        } else {
            delete updatedUser.password;
            return res.status(200).json({ user: updatedUser, message: 'Profile updated successfully! ' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        // Find the user by their ID
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Use 'return' to stop further execution
        }

        // Check if the current password is valid
        const isPasswordValid = await user.matchPassword(req.body.currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid current password' }); // Use 'return' to stop further execution
        }

        // Update the user's password
        user.password = req.body.newPassword;
        await user.save();

        // Respond with success message
        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        // Handle unexpected errors
        console.error(error); // Optional: log the error for debugging purposes
        return res.status(500).json({ error: 'An unexpected error occurred' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword
};
