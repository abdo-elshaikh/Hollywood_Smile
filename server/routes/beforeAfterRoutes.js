const express = require('express');
const router = express.Router();
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
        res.status(200).json(beforeAfterImage);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Add a new before and after image
router.post('/', async (req, res) => {
    const beforeAfter = new BeforeAfter({
        beforeImage: req.body.beforeImage,
        afterImage: req.body.afterImage,
        description: req.body.description,
        title: req.body.title,
        code: req.body.code,
    });

    try {
        const savedBeforeAfter = await beforeAfter.save();
        res.status(201).json(savedBeforeAfter);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// Update a before and after image
router.put('/:beforeAfterId', async (req, res) => {
    try {
        const updatedBeforeAfter = await BeforeAfter.updateOne(
            { _id: req.params.beforeAfterId },
            {
                $set: {
                    beforeImage: req.body.beforeImage,
                    afterImage: req.body.afterImage,
                    description: req.body.description,
                    title: req.body.title,
                    code: req.body.code,
                },
            }
        );
        res.status(200).json(updatedBeforeAfter);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Delete a before and after image
router.delete('/:beforeAfterId', async (req, res) => {
    try {
        const removedBeforeAfter = await BeforeAfter.remove({ _id: req.params.beforeAfterId });
        res.status(200).json(removedBeforeAfter);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports = router;