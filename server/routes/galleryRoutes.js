// routes/galleryRoutes.js
const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery'); // Import the Gallery model

// Create a new gallery item
router.post('/', async (req, res) => {
    try {
        const galleryItem = new Gallery(req.body);
        const savedItem = await galleryItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all gallery items
router.get('/', async (req, res) => {
    try {
        const galleryItems = await Gallery.find();
        res.status(200).json(galleryItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific gallery item by ID
router.get('/:id', async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(galleryItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a specific gallery item by ID
router.put('/:id', async (req, res) => {
    try {
        const exsitisGallery = await Gallery.findById(req.params.id)
        if (!exsitisGallery) return res.status(404).json({ error: 'Item not found' });
        const updatedItem = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a specific gallery item by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Gallery.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// add like to a specific gallery item by ID
router.put('/:id/like', async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) return res.status(404).json({ error: 'Item not found' });
        galleryItem.likes += 1;
        const updatedItem = await galleryItem.save();
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// add love to a specific gallery item by ID
router.put('/:id/love', async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) return res.status(404).json({ error: 'Item not found' });
        galleryItem.loves += 1;
        const updatedItem = await galleryItem.save();
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;