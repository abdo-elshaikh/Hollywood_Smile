// api/services.js
const { getServices,
    getServiceById,
    createService,
    updateService,
    deleteService, } = require('../controllers/serviceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

module.exports = async (req, res) => {
    switch (req.method) {
        case 'GET':
            if (req.url === '/') {
                return getServices(req, res);
            } else if (req.url.startsWith('/')) {
                return getServiceById(req, res);
            }
            break;

        case 'POST':
            return protect(req, res, authorize('admin'), createService);
            break;

        case 'PUT':
            return protect(req, res, authorize('admin'), updateService);
            break;

        case 'DELETE':
            return protect(req, res, authorize('admin'), deleteService);
            break;

        default:
            return res.status(405).send({ message: 'Method Not Allowed' });
    }
};
