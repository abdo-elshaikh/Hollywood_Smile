// controllers/notificationController.js
const Notification = require('../models/Notification');

// Create a new notification
const createNotification = async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        res.status(201).json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create notification', error });
    }
};

// Get all notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch notifications', error });
    }
};


// Mark a notification as read
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.status(200).json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to mark notification as read', error });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete notification', error });
    }
};

// clear notifications
const clearNotifications = async (req, res) => {
    try {
        await Notification.deleteMany();
        res.status(200).json({ success: true, message: 'Notifications cleared' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to clear notifications', error });
    }
};

// Export the notification controller
module.exports = {
    createNotification,
    markAsRead,
    deleteNotification,
    getNotifications,
    clearNotifications
};
