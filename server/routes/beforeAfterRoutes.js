const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const BeforeAfter = require('../models/BeforeAfter');

// Get all before and after images
router.get('/', async (req, res) => {
    try {
        const beforeAfterImages = await BeforeAfter.find();
        res.json(beforeAfterImages);
    } catch (err) {
        res.json({ message: err });
    }
});

// Get a specific before and after image
router.get('/:beforeAfterId', async (req, res) => {
    try {
        const beforeAfterImage = await BeforeAfter.findById(req.params.beforeAfterId);
        if (!beforeAfterImage) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(beforeAfterImage);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Add a new before and after image
router.post('/', protect, async (req, res) => {
    console.log(req.body);
    try {
        const newBeforeAfter = await BeforeAfter.create(req.body);
        if (!newBeforeAfter) return res.status(400).json({ error: 'Error creating item' });
        res.status(201).json(newBeforeAfter);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Update a before and after image
router.put('/:beforeAfterId', protect, async (req, res) => {
    try {
        const updatedBeforeAfter = await BeforeAfter.findByIdAndUpdate(req.params.beforeAfterId, req.body, { new: true });
        if (!updatedBeforeAfter) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(updatedBeforeAfter);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Delete a before and after image
router.delete('/:beforeAfterId', protect, async (req, res) => {
    console.log(req.params.beforeAfterId);
    try {
        const deletedBeforeAfter = await BeforeAfter.findByIdAndDelete(req.params.beforeAfterId);
        if (!deletedBeforeAfter) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(deletedBeforeAfter);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;
