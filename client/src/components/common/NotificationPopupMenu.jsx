import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Divider,
    Tooltip,
    IconButton,
    Badge,
    CircularProgress,
} from '@mui/material';
import { Notifications, ClearAllTwoTone } from '@mui/icons-material';
import notificationService from '../../services/notificationService';
import NotificationDetails from './NotificationDetails';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NotificationPopupMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);
    const { user } = useAuth();


    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications();
            const unreadNotifications = data.filter((notification) => !notification.read).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const userNotifications = user.role === 'admin' ? unreadNotifications : unreadNotifications.filter((notification) => notification.ref === 'blog');
            setNotifications(userNotifications);
            setUnreadCount(userNotifications.length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewAllNotifications = () => {
        navigate('/dashboard/notifications');
        handleMenuClose();
    };

    const handleViewNotificationDetails = (notification) => {
        setSelectedNotification(notification);
    };

    const handleDetailsClose = () => {
        setSelectedNotification(null);
        handleMenuClose();
        fetchNotifications();
    };

    const handleClearAll = async () => {
        setLoading(true);
        try {
            await Promise.all(
                notifications.map((notification) =>
                    notificationService.markAsRead(notification._id)
                )
            );
            await fetchNotifications();
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        } finally {
            setLoading(false);
            handleMenuClose();
        }
    };

    return (
        <Box>
            <Tooltip title="Notifications" onClick={handleMenuClick} arrow>
                <IconButton color="inherit" sx={{ ml: 1 }}>
                    <Badge badgeContent={unreadCount} color="secondary">
                        <Notifications />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >
                <Box sx={{ padding: 2, width: 300 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Notifications</Typography>
                        <Tooltip title="Clear All">
                            <IconButton onClick={handleClearAll} disabled={loading}>
                                {loading ? <CircularProgress size={20} /> : <ClearAllTwoTone />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <List>
                        {notifications.length > 0 ? (
                            notifications.slice(0, 5).map((notification) => (
                                <ListItem
                                    button
                                    key={notification._id}
                                    onClick={() => handleViewNotificationDetails(notification)}
                                    sx={{
                                        cursor: 'pointer',
                                        backgroundColor: notification.read ? 'inherit' : 'rgba(0,0,0,0.1)',
                                        position: 'relative',
                                    }}
                                >
                                    {notification.read ? null : (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: 15,
                                                height: 15,
                                                borderRadius: '50%',
                                                backgroundColor: 'red',
                                            }}
                                        />
                                    )}
                                    <ListItemText
                                        primary={notification.title}
                                        secondary={notification.message.slice(0, 40) + '...'}
                                        sx={{ width: '100%' }}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No notifications available." />
                            </ListItem>
                        )}
                    </List>
                </Box>
                <Divider />
                <MenuItem onClick={handleViewAllNotifications}>View All Notifications</MenuItem>
            </Menu>

            <NotificationDetails
                open={Boolean(selectedNotification)}
                onClose={handleDetailsClose}
                notification={selectedNotification}
            />
        </Box>
    );
};

export default NotificationPopupMenu;
