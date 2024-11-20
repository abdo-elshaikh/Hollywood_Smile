// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Route to create a new notification
router.post('/', notificationController.createNotification);

// Route to get all notifications
router.get('/', protect, notificationController.getNotifications);

// Route to mark a notification as read
router.put('/:id/mark-read', protect, notificationController.markAsRead);

// Route to delete a notification
router.delete('/:id', protect, notificationController.deleteNotification);

module.exports = router;
