const fs = require("fs").promises;
const path = require("path");
const fsExtra = require("fs-extra");
const fileType = require("file-type");
const sanitize = require("sanitize-filename");
const { upload, uploadMultiple } = require("../middlewares/uploadMiddleware");

// Upload single file
const uploadFile = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        const { directoryPath } = req.query;
        const sanitizedFilename = sanitize(req.file.originalname);
        const url = `${req.protocol}://${req.get("host")}/uploads/${directoryPath}/${sanitizedFilename}`;
        res.json({ message: "File uploaded successfully", url });
    } catch (err) {
        if (err.message === "File already exists") {
            return res.status(409).json({ error: "File already exists" });
        }
        res.status(500).json({ error: "File upload failed", details: err.message });
    }
};

// Upload multiple files
const uploadMultipleFiles = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            uploadMultiple(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        res.json({ message: "Files uploaded successfully", files: req.files });
    } catch (err) {
        if (err.message === "File already exists") {
            return res.status(409).json({ error: "One or more files already exist" });
        }
        res.status(500).json({ error: "Multiple file upload failed", details: err.message });
    }
};

// Get files in a directory
const getFilesInDirectory = async (req, res) => {
    const directoryPath = req.query.directoryPath || "";
    const basePath = path.join(__dirname, "../uploads", directoryPath);

    try {
        await fs.access(basePath); // Ensure the directory exists
        const files = await fs.readdir(basePath);

        const directoryFiles = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(basePath, file);
                const stat = await fs.stat(filePath);
                const fileTypeInfo = stat.isDirectory()
                    ? { ext: "directory", mime: "directory" }
                    : (await fileType.fromFile(filePath)) || { ext: "unknown", mime: "unknown" };

                return {
                    name: file,
                    type: fileTypeInfo.mime,
                    size: stat.size,
                    createdAt: stat.birthtime,
                    modifiedAt: stat.mtime,
                };
            })
        );

        res.json({ files: directoryFiles });
    } catch (err) {
        res.status(500).json({ error: "Error fetching files", details: err.message });
    }
};

// Delete file or directory
const deleteItem = async (req, res) => {
    const { directoryPath, itemName } = req.query;
    const itemPath = path.join(__dirname, "../uploads", directoryPath, itemName);

    try {
        const stat = await fs.lstat(itemPath);
        if (stat.isDirectory()) {
            await fsExtra.remove(itemPath);
        } else {
            await fs.unlink(itemPath);
        }
        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting the item", details: err.message });
    }
};

// Create a new directory or file
const createItem = async (req, res) => {
    const { directoryPath, name, type } = req.body;
    const itemPath = path.join(__dirname, "../uploads", directoryPath, name);

    try {
        if (type === "directory") {
            await fs.mkdir(itemPath, { recursive: true });
        } else {
            await fs.writeFile(itemPath, "");
        }
        res.json({ message: `${type === "directory" ? "Directory" : "File"} created successfully` });
    } catch (err) {
        res.status(500).json({ error: `Error creating the ${type}`, details: err.message });
    }
};

// Fetch all files recursively from a directory
const getAllFilesRecursive = async (dirPath) => {
    const results = [];
    const list = await fs.readdir(dirPath);

    for (const file of list) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.lstat(filePath);

        if (stat.isDirectory()) {
            results.push(...(await getAllFilesRecursive(filePath)));
        } else {
            results.push(filePath);
        }
    }
    return results;
};

// Get all files
const getAllFiles = async (req, res) => {
    const basePath = path.join(__dirname, "../uploads");

    try {
        await fs.access(basePath); // Ensure the base directory exists
        const files = await getAllFilesRecursive(basePath);
        res.json({ files: files.map((file) => path.relative(basePath, file)) });
    } catch (err) {
        res.status(500).json({ error: "Error fetching all files", details: err.message });
    }
};

// Copy file
const copyFile = async (req, res) => {
    const { source, destination } = req.body;
    const sourcePath = path.join(__dirname, "../uploads", source);
    const destinationPath = path.join(__dirname, "../uploads", destination);

    try {
        await fsExtra.copy(sourcePath, destinationPath);
        res.json({ message: "File copied successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error copying file", details: err.message });
    }
};

// Move file
const moveFile = async (req, res) => {
    const { source, destination } = req.body;
    const sourcePath = path.join(__dirname, "../uploads", source);
    const destinationPath = path.join(__dirname, "../uploads", destination);

    try {
        await fsExtra.move(sourcePath, destinationPath);
        res.json({ message: "File moved successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error moving file", details: err.message });
    }
};

// Rename file
const renameFile = async (req, res) => {
    const { currentPath, oldName, newName } = req.body;
    const oldPath = path.join(__dirname, "../uploads", currentPath, oldName);
    const newPath = path.join(__dirname, "../uploads", currentPath, newName);

    try {
        await fs.rename(oldPath, newPath);
        res.json({ message: "File renamed successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error renaming file", details: err.message });
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
