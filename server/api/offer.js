const {
    getOffers,
    createOffer,
    updateOffer,
    deleteOffer,
} = require('../controllers/offersController');

module.exports = async (req, res) => {
    switch (req.method) {
        case 'GET':
            return getOffers(req, res);
        case 'POST':
            return createOffer(req, res);
        case 'PUT':
            return updateOffer(req, res);
        case 'DELETE':
            return deleteOffer(req, res);
        default:
            return res.status(405).send({ message: 'Method Not Allowed' });
    }
};
