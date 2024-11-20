const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const Message = require('../models/Message');

// Get all messages
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const messages = await Message.find({});
        if (messages.length === 0) return res.status(404).json({ message: 'No messages found' });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve messages' });
    }
});

// Get a single message
router.get('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving message' });
    }
});

// Create a message
router.post('/', async (req, res) => {
    try {
        const message = await Message.create(req.body);
        res.status(201).json(message);
    } catch (err) {
        res.status(400).json({ message: 'Invalid message data' });
    }
});

// Update a message
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.status(200).json(message);
    } catch (err) {
        res.status(400).json({ message: 'Error updating message' });
    }
});

// Delete a message
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting message' });
    }
});

module.exports = router;
