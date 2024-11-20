const express = require('express');
const router = express.Router();
const ThemeSettings = require('../models/ThemeSettings');

// Get all theme settings
router.get('/', async (req, res) => {
    try {
        const settings = await ThemeSettings.find();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific theme setting by ID
router.get('/:mode', async (req, res) => {
    try {
        const setting = await ThemeSettings.findeOne({ mode: req.params.mode });
        // if existing
        if (setting) {
            res.status(200).json(setting);
        } else {
            res.status(404).json({ message: 'Theme setting not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new theme setting
router.post('/', async (req, res) => {
    const newSetting = new ThemeSettings(req.body);
    try {
        const existingSetting = await ThemeSettings.findeOne({ mode: req.body.mode });
        if (existingSetting) return res.status(400).json({ message: 'Theme setting already exists' });
        const createdSetting = await newSetting.save();
        res.status(201).json(createdSetting);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an existing theme setting
router.put('/:mode', async (req, res) => {
    try {
        const updatedSetting = await ThemeSettings.findOneAndUpdate({ mode: req.params.mode }, req.body, { new: true });
        if (!updatedSetting) return res.status(404).json({ message: 'Theme setting not found' });
        res.status(200).json(updatedSetting);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a theme setting
router.delete('/:mode', async (req, res) => {
    try {
        const deletedSetting = await ThemeSettings.findOneAndDelete({ mode: req.params.mode });
        if (!deletedSetting) return res.status(404).json({ message: 'Theme setting not found' });
        res.status(200).json(deletedSetting);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
