const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const router = express.Router();

// Configure Multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route to upload image to Cloudinary
router.post('/upload', async (req, res) => {
    console.log(req, 'reqession session');
    try {
        const result = await cloudinary.uploader.upload(req.file);
        console.log(result, 'result');
        res.json({ url: result.secure_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload failed' });
    }
});

// Export the router
module.exports = router;
