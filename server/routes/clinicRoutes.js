const express = require('express');
const router = express.Router();
const Clinic = require('../models/Clinic');
const { authorize } = require('../middlewares/authMiddleware');

// @route   GET /api/clinic
// @desc    Get clinic information
// @access  Public
router.get('/', async (req, res) => {
    try {
        const clinic = await Clinic.findOne();
        if (!clinic) return res.status(404).json({ message: 'Clinic information not found' });
        res.status(200).json(clinic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/clinic
// @desc    Update clinic information
// @access  Protected
router.put('/', async (req, res) => {
    try {
        const clinic = await Clinic.findOne();
        if (!clinic) {
            await Clinic.create(req.body);
        } else {
            await Clinic.updateOne({ $set: req.body });
        }
        const updatedClinic = await Clinic.findOne();
        if (!updatedClinic) return res.status(404).json({ message: 'Clinic information not found', success: false });
        res.status(200).json({ clinic: updatedClinic, success: true });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
