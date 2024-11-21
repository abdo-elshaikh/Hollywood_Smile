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
} = require('../controllers/fileController');

module.exports = async (req, res) => {
    switch (req.method) {
        case 'POST':
            if (req.url === '/upload') {
                return uploadFile(req, res);
            } else if (req.url === '/upload-multiple') {
                return uploadMultipleFiles(req, res);
            } else if (req.url === '/create') {
                return createItem(req, res);
            }
            break;

        case 'GET':
            if (req.url === '/list') {
                return getFilesInDirectory(req, res);
            } else if (req.url === '/all') {
                return getAllFiles(req, res);
            }
            break;

        case 'DELETE':
            if (req.url === '/delete') {
                return deleteItem(req, res);
            }
            break;

        case 'PUT':
            if (req.url === '/copy') {
                return copyFile(req, res);
            } else if (req.url === '/move') {
                return moveFile(req, res);
            } else if (req.url === '/rename') {
                return renameFile(req, res);
            }
            break;

        default:
            return res.status(405).send({ message: 'Method Not Allowed' });
    }
};