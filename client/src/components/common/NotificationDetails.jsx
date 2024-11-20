import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Chip,
    Divider,
    Stack,
} from '@mui/material';
import { Notifications, Info, CheckCircle } from '@mui/icons-material';
import NotificationService from '../../services/notificationService';

const NotificationDetails = ({ notification, open, onClose }) => {

    const handleMarkAsRead = async () => {
        try {
            await NotificationService.markAsRead(notification._id);
            onClose();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
                Notification Details
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    {/* Title */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <Notifications color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Title:</Typography>
                        <Typography variant="body1">{notification?.title}</Typography>
                    </Box>

                    {/* Type */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <Info color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Type:</Typography>
                        <Typography variant="body1">{notification?.type}</Typography>
                    </Box>

                    <Divider />

                    {/* Message */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" fontWeight="bold">Message:</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ p: 2, border: '1px solid', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
                        {notification?.message}
                    </Typography>

                    <Divider />

                    {/* Status */}
                    <Box display="flex" justifyContent="space-between">
                        <Chip
                            label={notification?.read ? 'Read' : 'Unread'}
                            color={notification?.read ? 'success' : 'warning'}
                            icon={<CheckCircle />}
                        />
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                {!notification?.read && (
                    <Button variant="contained" color="primary" onClick={handleMarkAsRead}>
                        Mark as Read
                    </Button>
                )}
                <Button onClick={onClose} color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NotificationDetails;
