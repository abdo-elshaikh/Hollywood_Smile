const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const multer = require("multer");
const fileType = require('file-type');
const { upload, uploadMultiple } = require('../middlewares/uploadMiddleware');
const logger = require('../utils/logger');

// Upload single file
const uploadFile = (req, res) => {

    upload(req, res, (err) => {
        if (err) {
            logger.error(`Error during file upload: ${err.message}`, { method: 'uploadFile', file: req.file?.originalname });
            if (err.message === "File already exists") {
                return res.status(409).json({ error: "File already exists" });
            }
            return res.status(500).json({ error: "File upload failed", details: err.message });
        }
        const { directoryPath } = req.query;
        const url = `${req.protocol}://${req.get("host")}/uploads/${directoryPath}/${req.file.filename}`;
        res.json({ message: "File uploaded successfully", url });
    });
};

// Upload multiple files
const uploadMultipleFiles = (req, res) => {
    uploadMultiple(req, res, (err) => {
        if (err) {
            if (err.message === "File already exists") {
                return res.status(409).json({ error: "One or more files already exist" }); // 409 Conflict status
            }
            return res.status(500).json({ error: "Multiple file upload failed", details: err.message });
        }
        res.json({ message: "Files uploaded successfully", files: req.files });
    });
};

const getFilesInDirectory = async (req, res) => {
    const directoryPath = req.query.directoryPath || "";
    const basePath = path.join(__dirname, "../uploads", directoryPath);

    // Check if directory exists
    if (!fs.existsSync(basePath)) {
        return res.status(404).json({ message: "Directory not found" });
    }

    // Read the directory contents
    fs.readdir(basePath, async (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching files", details: err.message });
        }

        const directoryFiles = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(basePath, file);
                const stat = fs.statSync(filePath);
                let fileTypeInfo = { ext: "", mime: "" };

                if (!stat.isDirectory()) {
                    // Use file-type to determine the file type
                    const buffer = fs.readFileSync(filePath, { start: 0, end: 4100 });
                    fileTypeInfo = await fileType.fromBuffer(buffer) || { ext: 'unknown', mime: 'unknown' };
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

        res.json({ files: directoryFiles });
    });
};

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
        res.status(500).json({ error: "Error deleting the item", details: err.message });
    }
};


// Create a new directory or file
const createItem = (req, res) => {
    const { directoryPath, name, type } = req.body;
    const itemPath = path.join(__dirname, "../uploads", directoryPath, name);

    try {
        if (type === "directory") {
            fsExtra.ensureDirSync(itemPath);
        } else {
            fs.writeFileSync(itemPath, "");
        }
        res.json({ message: `${type === "directory" ? "Directory" : "File"} created successfully` });
    } catch (error) {
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

// Fetch all files
const getAllFiles = (req, res) => {
    const basePath = path.join(__dirname, "../uploads");

    if (!fs.existsSync(basePath)) {
        return res.status(404).json({ message: "No files found" });
    }

    try {
        const files = getAllFilesRecursive(basePath);
        res.json({ files: files.map((file) => path.relative(basePath, file)) });
    } catch (error) {
        res.status(500).json({ error: "Error fetching all files", details: error.message });
    }
};

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
        console.error(`Error copying file: ${error.message}`);
        res.status(500).json({ error: "Error copying file", details: error.message });
    }
};

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
        console.error(`Error moving file: ${error.message}`);
        res.status(500).json({ error: "Error moving file", details: error.message });
    }
};

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
