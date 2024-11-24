const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const sanitize = require("sanitize-filename");
const dotenv = require("dotenv");
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "uploads", // Set folder for uploaded files
        format: async (req, file) => path.extname(file.originalname).split(".")[1], // Set format of the file
        public_id: (req, file) => sanitize(file.originalname.split(".")[0]), // Set sanitized public ID
        resource_type: "auto", // Set the resource type
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        max_files: 10,
        allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "txt", "csv", "xls", "xlsx"],
        access_mode: "public",
        //  max image file size 10MB
        max_bytes: 10 * 1024 * 1024,
        
    },
});
const upload = multer({ storage });

// Upload single file
const uploadFile = (req, res) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: "File upload failed", details: err.message });
        }
        res.json({
            message: "File uploaded successfully",
            url: req.file.path, // Cloudinary file URL
        });
    });
};

// Upload multiple files
const uploadMultipleFiles = (req, res) => {
    upload.array("files", 10)(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: "Multiple file upload failed", details: err.message });
        }
        const files = req.files.map((file) => ({
            url: file.path, // Cloudinary file URL
            id: file.filename, // Public ID on Cloudinary
        }));
        res.json({ message: "Files uploaded successfully", files });
    });
};

// Delete file
const deleteItem = async (req, res) => {
    const { public_id } = req.body; // Cloudinary public ID of the file
    try {
        await cloudinary.uploader.destroy(public_id);
        res.json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting the file", details: error.message });
    }
};

// Get all files in a folder
const getFilesInDirectory = async (req, res) => {
    const { folder } = req.query || "uploads";
    try {
        const resources = await cloudinary.search
            .expression(`folder:${folder}`)
            .max_results(50)
            .execute();

        const files = resources.resources.map((file) => ({
            url: file.secure_url,
            public_id: file.public_id,
            format: file.format,
            size: file.bytes,
            created_at: file.created_at,
        }));
        res.json({ files });
    } catch (error) {
        res.status(500).json({ error: "Error fetching files", details: error.message });
    }
};

// Copy file
const copyFile = async (req, res) => {
    const { source, destination } = req.body;
    try {
        const result = await cloudinary.uploader.rename(source, destination);
        res.json({ message: "File copied successfully", file: result });
    } catch (error) {
        res.status(500).json({ error: "Error copying file", details: error.message });
    }
};

// Move file
const moveFile = async (req, res) => {
    const { source, destination } = req.body;
    try {
        const result = await cloudinary.uploader.rename(source, destination);
        res.json({ message: "File moved successfully", file: result });
    } catch (error) {
        res.status(500).json({ error: "Error moving file", details: error.message });
    }
};

// Rename file
const renameFile = async (req, res) => {
    const { public_id, new_name } = req.body;
    try {
        const result = await cloudinary.uploader.rename(public_id, new_name);
        res.json({ message: "File renamed successfully", file: result });
    } catch (error) {
        res.status(500).json({ error: "Error renaming file", details: error.message });
    }
};

module.exports = {
    uploadFile,
    uploadMultipleFiles,
    getFilesInDirectory,
    deleteItem,
    copyFile,
    moveFile,
    renameFile,
};
