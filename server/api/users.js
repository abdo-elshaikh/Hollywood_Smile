// api/users.js
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

module.exports = async (req, res) => {
    switch (req.method) {
        case 'GET':
            if (req.url === '/') {
                return getAllUsers(req, res);
            }
            break;

        case 'POST':
            return createUser(req, res);

        case 'PUT':
            return protect(req, res, authorize('admin'), updateUser);

        case 'DELETE':
            return protect(req, res, authorize('admin'), deleteUser);

        default:
            return res.status(405).send({ message: 'Method Not Allowed' });
    }
};
