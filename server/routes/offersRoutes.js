const express = require('express');
const router = express.Router();
const { getOffers, createOffer, updateOffer, deleteOffer } = require('../controllers/offersController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getOffers);
router.post('/', protect, createOffer);
router.put('/:id', protect, updateOffer);
router.delete('/:id', protect, deleteOffer);

module.exports = router;
