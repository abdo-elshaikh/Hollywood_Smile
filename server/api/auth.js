// api/auth.js
const { registerUser, loginUser, getUserProfile, updateUserProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

module.exports = async (req, res) => {
    switch (req.method) {
        case 'POST':
            if (req.url === '/register') {
                return registerUser(req, res);
            } else if (req.url === '/login') {
                return loginUser(req, res);
            }
            break;

        case 'GET':
            if (req.url === '/profile') {
                return protect(req, res, getUserProfile);
            }
            break;

        case 'PUT':
            if (req.url === '/profile') {
                return protect(req, res, updateUserProfile);
            } else if (req.url === '/profile/change-password') {
                return protect(req, res, changePassword);
            }
            break;

        default:
            return res.status(405).send({ message: 'Method Not Allowed' });
    }
};
