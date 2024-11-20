const express = require('express');
const {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} = require('../controllers/servicesController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', getServices);

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', getServiceById);

// @route   POST /api/services
// @desc    Create a new service
// @access  Private/Admin
router.post('/', protect, authorize('admin'), createService);

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), updateService);

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Private/Admin
router.delete('/:id', deleteService);

module.exports = router;
