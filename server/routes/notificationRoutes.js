// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { createNotification, getNotifications, markAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Route to create a new notification
router.post('/', createNotification);

// Route to get all notifications
router.get('/', protect, getNotifications);

// Route to mark a notification as read
router.put('/:id/mark-read', protect, markAsRead);

// Route to delete a notification
router.delete('/:id', protect, deleteNotification);

module.exports = router;
