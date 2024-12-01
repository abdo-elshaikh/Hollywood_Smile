const express = require('express');
const router = express.Router();
const Theme = require('../models/Theme');
const { protect } = require('../middlewares/authMiddleware');


// Get theme settings
router.get('/:mode', async (req, res) => {
    try {
        const theme = await Theme.findOne({ mode: req.params.mode });
        if (!theme) {
            return res.status(404).json({ message: 'Theme settings not found' });
        }
        res.json(theme);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update theme settings
router.put('/:mode', protect, async (req, res) => {
    try {
        const theme = await Theme.findOne({ mode: req.params.mode });
        if (!theme) {
            const newTheme = new Theme({ mode: req.params.mode, colors: req.body });
            await newTheme.save();
            return res.status(201).json(newTheme);
        }
        theme.colors = req.body;
        await theme.save();
        res.status(200).json(theme);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
