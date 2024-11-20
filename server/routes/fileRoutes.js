const express = require("express");
const {
    uploadFile,
    uploadMultipleFiles,
    getFilesInDirectory,
    deleteItem,
    createItem,
    getAllFiles,
    copyFile,
    moveFile,
    renameFile,
} = require("../controllers/fileController");

const router = express.Router();

// Using query parameter instead of URL parameter for directory path
router.get("/", getFilesInDirectory);

// Route for uploading a single file
router.post("/upload?:directoryPath", uploadFile);

// Route for uploading multiple files
router.post("/upload-multiple", uploadMultipleFiles);

// Route for creating a new file or directory
router.post("/create", createItem);

// Route for fetching all files
router.get("/all-files", getAllFiles);

// Route for deleting a file or directory
router.delete("/delete", deleteItem);

// Route for copying a file or directory
router.post("/copy", copyFile);

// Route for moving a file or directory
router.post("/move", moveFile);

// Route for renaming a file or directory
router.post("/rename", renameFile);

module.exports = router;
