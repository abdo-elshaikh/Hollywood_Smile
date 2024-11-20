const multer = require("multer");
const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");

// Multer storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const directoryPath = req.query.directoryPath || '';
        const BasePath = path.join(__dirname, "../uploads", directoryPath);

        if (!fs.existsSync(BasePath)) {
            fs.mkdirSync(BasePath, { recursive: true }, (err) => {
                if (err) {
                    cb(err, err);
                }
            });
        }
        cb(null, BasePath);
    },
    filename: (req, file, cb) => {
        // check if the file exists
        const filePath = path.join(__dirname, "../uploads", req.params.directoryPath || "", file.originalname);
        if (fs.existsSync(filePath)) {
            return cb(new Error("File already exists"));
        }
        cb(null, file.originalname);
    },
});

// Multer upload settings
const upload = multer({ storage }).single("file");
const uploadMultiple = multer({ storage }).array("files", 10);

module.exports = { upload, uploadMultiple };