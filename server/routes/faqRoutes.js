// routes/faq.js
const express = require('express');
const FAQ = require('../models/FAQ');
const router = express.Router();

// Get all FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new FAQ
router.post('/', async (req, res) => {
    try {
        const faq = await FAQ.create(req.body);
        res.status(201).json(faq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an FAQ
router.put('/:id', async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(faq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an FAQ
router.delete('/:id', async (req, res) => {
    try {
        await FAQ.findByIdAndDelete(req.params.id);
        res.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
