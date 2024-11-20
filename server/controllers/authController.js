const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // check if email or name is already registered
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);
        const userData = user.toObject();
        delete userData.password;

        res.status(201).json({ token, user: userData, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email: identifier }, { name: identifier }] });

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
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.avatarUrl = req.body.avatarUrl || user.avatarUrl;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            const token = generateToken(updatedUser._id);

            res.status(200).json({ token, user: updatedUser });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const updatedUser = await User.findById(req.user._id);
        if (updatedUser) {
            updatedUser.password = req.body.password;
            const user = await updatedUser.save();
            const token = generateToken(user._id);
            res.status(200).json({ token, user, message: 'Password changed successfully! ' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword
};
