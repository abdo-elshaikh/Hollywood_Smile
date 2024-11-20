const express = require('express');
const router = express.Router();
const { getOffers, createOffer, updateOffer, deleteOffer } = require('../controllers/offersController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', getOffers);
router.post('/', protect, authorize('admin'), createOffer);
router.put('/:id', protect, authorize('admin'), updateOffer);
router.delete('/:id', protect, authorize('admin'), deleteOffer);

module.exports = router;
