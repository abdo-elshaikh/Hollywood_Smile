const express = require('express');
const multer = require('multer');
const { supabase, uploadFile } = require('../config/supabaseClient');
const path = require('path');
const tus = require('tus-js-client');


const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

// Get file upload URL
const getFileUploadUrl = async (filePath) => {
    try {
        const { signedURL, error } = await supabase.storage
            .from('uploads')
            .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year
        if (error) {
            console.error('Error creating signed URL:', error.message);
            return null;
        }
        return signedURL;
    } catch (error) {
        console.error('Error getting file upload URL:', error.message);
        return null;
    }
};

// create a bucket
router.post('/create-bucket', async (req, res) => {
    try {
        const { bucketName, allowedMimeTypes } = req.body;
        const { data, error } = await supabase.storage.createBucket(bucketName, { public: true, allowedMimeTypes: allowedMimeTypes });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// upload large file to Supabase storage
router.post('/upload-large', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const { directory } = req.body;

        if (!file) return res.status(400).json({ error: 'No file uploaded' });
        if (!directory) return res.status(400).json({ error: 'Directory not specified' });


        const safeDirectory = path.join('/', directory.replace(/[^a-zA-Z0-9_\-/]/g, '')).replace(/\\/g, '/');
        const directoryPath = safeDirectory.endsWith('/') ? safeDirectory : `${safeDirectory}/`;

        const fileName = `${Date.now()}_${file.originalname}`;
        const filePath = `${directoryPath}${fileName}`;

        await uploadFile('uploads', filePath, file.buffer);

        const publicUrl = await getFileUploadUrl(filePath);

        if (publicUrl) {
            console.log('File uploaded:', publicUrl);
            return res.status(200).json({ url: publicUrl, message: 'File uploaded successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload file to Supabase storage
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const { directory } = req.body;

        if (!file) return res.status(400).json({ error: 'No file uploaded' });
        if (!directory) return res.status(400).json({ error: 'Directory not specified' });

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return res.status(400).json({ error: 'Unsupported file type' });
        }

        const safeDirectory = path.join('/', directory.replace(/[^a-zA-Z0-9_\-/]/g, '')).replace(/\\/g, '/');
        const directoryPath = safeDirectory.endsWith('/') ? safeDirectory : `${safeDirectory}/`;

        const fileName = `${Date.now()}_${file.originalname}`;
        const filePath = `${directoryPath}${fileName}`;

        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (error) {
            return res.status(500).json({ error: error.message, details: error.details || '' });
        }

        const publicUrl = await getFileUploadUrl(filePath);

        if (publicUrl) {
            console.log('File uploaded:', publicUrl, data);
            return res.status(200).json({ url: publicUrl, data, message: 'File uploaded successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete file from Supabase storage
router.delete('/delete/:filePath', async (req, res) => {
    try {
        const { filePath } = req.params;

        const { error } = await supabase.storage.from('uploads').remove([filePath]);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// copy an object within the same bucket
router.post('/copy', async (req, res) => {
    try {
        const { source, destination } = req.body;

        const { data, error } = await supabase.storage
            .from('uploads')
            .copy(source, destination, {
                destinationBucket: 'uploads',
            });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// move an object within the same bucket
router.post('/move', async (req, res) => {
    try {
        const { source, destination } = req.body;

        const { data, error } = await supabase.storage
            .from('uploads')
            .move(source, destination, {
                destinationBucket: 'uploads',
            });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
