const express = require('express');
const router = express.Router();
const Subscribe = require('../models/Subscribe');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        const existingSubscriber = await Subscribe.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Email already exists.', exists: true });
        }
        const subscriber = new Subscribe({ email });
        await subscriber.save();
        res.status(201).json({ message: 'Subscribed successfully.', success: true });
    } catch (error) {
        console.error('Error subscribing:', error);
        res.status(500).json({ message: 'Failed to subscribe.', error: error });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        const subscribers = await Subscribe.find();
        res.status(200).json({ subscribers, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subscribers.', error: error });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const subscriber = await Subscribe.findById(req.params.id);
        if (!subscriber) {
            return res.status(404).json({ message: 'Subscriber not found.', success: false });
        }
        await subscriber.remove();
        res.json({ message: 'Subscriber removed.', success: true });
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        res.status(500).json({ message: 'Failed to delete subscriber.', error: error });
    }
});

module.exports = router;