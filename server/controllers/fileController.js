const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const multer = require("multer");
const fileType = require('file-type');
const sanitize = require('sanitize-filename');
// const logger = require('../utils/logger');
const { upload, uploadMultiple } = require('../middlewares/uploadMiddleware');

// Upload single file
const uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            // logger.error(`Error during file upload: ${err.message}`, { method: 'uploadFile', file: req.file?.originalname });
            if (err.message === "File already exists") {
                return res.status(409).json({ error: "File already exists" });
            }
            return res.status(500).json({ error: "File upload failed", details: err.message });
        }

        const { directoryPath } = req.query;
        const sanitizedFilename = sanitize(req.file.originalname); // Sanitize filename
        const url = `${req.protocol}://${req.get("host")}/uploads/${directoryPath}/${sanitizedFilename}`;
        res.json({ message: "File uploaded successfully", url });
    });
};

// Upload multiple files
const uploadMultipleFiles = (req, res) => {
    uploadMultiple(req, res, (err) => {
        if (err) {
            // logger.error(`Error during multiple file upload: ${err.message}`, { method: 'uploadMultipleFiles' });
            if (err.message === "File already exists") {
                return res.status(409).json({ error: "One or more files already exist" });
            }
            return res.status(500).json({ error: "Multiple file upload failed", details: err.message });
        }
        res.json({ message: "Files uploaded successfully", files: req.files });
    });
};

// Get files in a directory
const getFilesInDirectory = async (req, res) => {
    const directoryPath = req.query.directoryPath || "";
    const basePath = path.join(__dirname, "../uploads", directoryPath);

    try {
        // Check if the directory exists
        const directoryExists = await fs.promises.access(basePath).then(() => true).catch(() => false);
        if (!directoryExists) {
            return res.status(404).json({ message: "Directory not found" });
        }

        // Read the directory contents asynchronously
        const files = await fs.promises.readdir(basePath);

        // Process each file asynchronously
        const directoryFiles = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(basePath, file);
                const stat = await fs.promises.stat(filePath);
                let fileTypeInfo = { ext: "", mime: "" };

                if (!stat.isDirectory()) {
                    // Read a portion of the file to determine its MIME type
                    const buffer = await fs.promises.readFile(filePath, { start: 0, end: 4100 });
                    fileTypeInfo = (await fileType.fromBuffer(buffer)) || { ext: 'unknown', mime: 'unknown' };
                } else {
                    fileTypeInfo.ext = "directory";
                    fileTypeInfo.mime = "directory";
                }

                return {
                    name: file,
                    type: fileTypeInfo.ext === "directory" ? "directory" : fileTypeInfo.mime,
                    size: stat.size,
                    createdAt: stat.birthtime,
                    modifiedAt: stat.mtime,
                };
            })
        );

        // Send back the list of files
        res.json({ files: directoryFiles });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: "Error fetching files", details: error.message });
    }
};

// Delete file or directory
const deleteItem = (req, res) => {
    const { directoryPath, itemName } = req.query;

    const itemPath = path.join(__dirname, "../uploads", directoryPath, itemName);

    if (!fs.existsSync(itemPath)) {
        return res.status(404).json({ message: "File or directory not found" });
    }

    try {
        if (fs.lstatSync(itemPath).isDirectory()) {
            fsExtra.removeSync(itemPath);
        } else {
            fs.unlinkSync(itemPath);
        }
        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        // logger.error(`Error deleting item: ${err.message}`, { method: 'deleteItem', item: itemName });
        res.status(500).json({ error: "Error deleting the item", details: err.message });
    }
};

// Create a new directory or file
const createItem = async (req, res) => {
    const { directoryPath, name, type } = req.body;
    const itemPath = path.join(__dirname, "../uploads", directoryPath, name);

    try {
        if (type === "directory") {
            await fs.promises.mkdir(itemPath, { recursive: true });
        } else {
            await fs.promises.writeFile(itemPath, "");
        }
        res.json({ message: `${type === "directory" ? "Directory" : "File"} created successfully` });
    } catch (error) {
        // logger.error(`Error creating item: ${error.message}`, { method: 'createItem', itemPath });
        res.status(500).json({ error: `Error creating the ${type}`, details: error.message });
    }
};

// Fetch all files recursively from a directory
const getAllFilesRecursive = (dirPath) => {
    let results = [];
    const list = fs.readdirSync(dirPath);
    list.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFilesRecursive(filePath));
        } else {
            results.push(filePath);
        }
    });
    return results;
};

// Get all files
const getAllFiles = (req, res) => {
    const basePath = path.join(__dirname, "../uploads");

    if (!fs.existsSync(basePath)) {
        return res.status(404).json({ message: "No files found" });
    }

    try {
        const files = getAllFilesRecursive(basePath);
        res.json({ files: files.map((file) => path.relative(basePath, file)) });
    } catch (error) {
        // logger.error(`Error fetching all files: ${error.message}`, { method: 'getAllFiles' });
        res.status(500).json({ error: "Error fetching all files", details: error.message });
    }
};

// Copy file
const copyFile = (req, res) => {
    const { source, destination } = req.body;
    const sourcePath = path.join(__dirname, "../uploads", source);
    let destinationPath = path.join(__dirname, "../uploads", destination);

    try {
        // Check if the destination is a directory
        if (fsExtra.lstatSync(destinationPath).isDirectory()) {
            // Append the original file name to the destination path
            const fileName = path.basename(sourcePath);
            destinationPath = path.join(destinationPath, fileName);
        }

        // Perform the file copy operation
        fsExtra.copySync(sourcePath, destinationPath);
        res.json({ message: "File copied successfully" });
    } catch (error) {
        // logger.error(`Error copying file: ${error.message}`, { method: 'copyFile', source, destination });
        res.status(500).json({ error: "Error copying file", details: error.message });
    }
};

// Move file
const moveFile = (req, res) => {
    const { source, destination } = req.body;
    const sourcePath = path.join(__dirname, "../uploads", source);
    let destinationPath = path.join(__dirname, "../uploads", destination);

    try {
        // Check if the destination is a directory
        if (fsExtra.lstatSync(destinationPath).isDirectory()) {
            // Append the original file name to the destination path
            const fileName = path.basename(sourcePath);
            destinationPath = path.join(destinationPath, fileName);
        }

        // Perform the file move operation
        fsExtra.moveSync(sourcePath, destinationPath);
        res.json({ message: "File moved successfully" });
    } catch (error) {
        // logger.error(`Error moving file: ${error.message}`, { method: 'moveFile', source, destination });
        res.status(500).json({ error: "Error moving file", details: error.message });
    }
};

// Rename file
const renameFile = (req, res) => {
    const { currentPath, oldName, newName } = req.body;
    const oldPath = path.join(__dirname, "../uploads", currentPath, oldName);
    const newPath = path.join(__dirname, "../uploads", currentPath, newName);

    if (!fs.existsSync(oldPath)) {
        return res.status(404).json({ message: "File not found" });
    }
    try {
        fsExtra.renameSync(oldPath, newPath);
        res.json({ message: "File renamed successfully" });
    } catch (error) {
        // logger.error(`Error renaming file: ${error.message}`, { method: 'renameFile', oldName, newName });
        res.status(500).json({ error: "Error renaming file", details: error.message });
    }
};

module.exports = {
    uploadFile,
    uploadMultipleFiles,
    getFilesInDirectory,
    deleteItem,
    createItem,
    getAllFiles,
    copyFile,
    moveFile,
    renameFile,
};
