import axiosInstance from './axiosInstance';

const NotificationService = {
    // Fetch all notifications for a specific user
    getNotificationsByUser: async (userId) => {
        try {
            const response = await axiosInstance.get(`/notifications/${userId}`);
            return response.data.notifications;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            throw error;
        }
    },

    // Create a new notification
    createNotification: async (data) => {
        try {
            const response = await axiosInstance.post('/notifications', data);
            return response.data;
        } catch (error) {
            console.error('Failed to create notification:', error);
            throw error;
        }
    },

    // Mark a notification as read
    markAsRead: async (notificationId) => {
        try {
            const response = await axiosInstance.put(`/notifications/${notificationId}/mark-read`);
            return response.data.notification;
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            throw error;
        }
    },

    // Delete a notification
    deleteNotification: async (notificationId) => {
        try {
            await axiosInstance.delete(`/notifications/${notificationId}`);
            return true;
        } catch (error) {
            console.error('Failed to delete notification:', error);
            throw error;
        }
    },

    // Fetch all notifications
    getNotifications: async () => {
        try {
            const response = await axiosInstance.get('/notifications');
            return response.data.notifications;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            throw error;
        }
    },
    // Clear all notifications
    clearNotifications: async () => {
        try {
            await axiosInstance.delete('/notifications');
            return true;
        } catch (error) {
            console.error('Failed to clear notifications:', error);
            throw error;
        }
    },
};

export default NotificationService;
