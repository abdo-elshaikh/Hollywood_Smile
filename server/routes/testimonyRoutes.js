const Testimony = require('../models/Testimony');
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

// @route   GET /api/testimonials
// @desc    Get all testimonials
// @access  Public
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimony.find();
        if (!testimonials) return res.status(404).json({ message: 'Testimonials not found' });
        res.status(200).json(testimonials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/testimonials/:id
// @desc    Get single testimonial
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const testimonial = await Testimony.findById(req.params.id);
        if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
        res.status(200).json(testimonial);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/testimonials
// @desc    Create new testimonial
// @access  Protected
router.post('/', async (req, res) => {
    try {
        const testimonial = await Testimony.create(req.body);
        if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
        res.status(200).json(testimonial);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/testimonials/:id
// @desc    Update testimonial
// @access  Protected
router.put('/:id', async (req, res) => {
    try {
        const testimonial = await Testimony.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
        res.status(200).json(testimonial);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial
// @access  Protected
router.delete('/:id', async (req, res) => {
    try {
        const testimonial = await Testimony.findByIdAndDelete(req.params.id);
        if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
        res.status(200).json({ message: 'Testimonial deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;