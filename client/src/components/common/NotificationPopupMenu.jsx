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
    Drawer,
    Button,
} from '@mui/material';
import { Notifications, ClearAllTwoTone, Close } from '@mui/icons-material';
import notificationService from '../../services/notificationService';
import NotificationDetails from './NotificationDetails';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NotificationPopupMenu = ({ source = 'admin-dashboard' }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);
    const { user } = useAuth();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications();
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const userNotifications = notificationsByUser(user.role, sortedData);
            setNotifications(userNotifications);
            setUnreadCount(userNotifications.filter((notification) => !notification.read).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const notificationsByUser = (role, notifications) => {
        if (role === 'admin') {
            return notifications;
        } else if (role === 'support') {
            return notifications.filter((notification) => notification.ref === 'booking');
        } else if (role === 'editor' || role === 'author') {
            return notifications.filter((notification) => notification.ref === 'blog');
        }
        return [];
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
        if (source === 'admin-dashboard') {
            navigate('/dashboard/notifications');
        } else {
            setDrawerOpen(true);
        }
        handleMenuClose();
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

    const handleDetailsClose = () => {
        setSelectedNotification(null);
        handleMenuClose();
        fetchNotifications();
    };

    return (
        <Box>
            <Tooltip title="Notifications" onClick={handleMenuClick} arrow>
                <IconButton>
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
                            notifications.filter((notification) => notification.read === false).slice(0, 5).map((notification) => (
                                <ListItem
                                    button
                                    key={notification._id}
                                    onClick={() => setSelectedNotification(notification)}
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
                                        sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                        noWrap
                                        primaryTypographyProps={{ fontWeight: 'bold', fontSize: 12 }}
                                        secondaryTypographyProps={{ fontSize: 10 }}
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
                <MenuItem color="primary.main" onClick={handleViewAllNotifications}>View All Notifications</MenuItem>
            </Menu>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box sx={{ width: 400, px: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">All Notifications</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <List
                        sx={{
                            height: 'calc(100vh - 64px)',
                            overflowY: 'scroll',
                            padding: 2,
                            '&::-webkit-scrollbar': {
                                width: 8,
                                height: 8,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'primary.main',
                                borderRadius: 8,
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: 'primary.dark',
                            },
                            '&::-webkit-scrollbar-thumb:active': {
                                backgroundColor: 'primary.dark',
                            },
                        }}
                    >
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <ListItem
                                    button
                                    key={notification._id}
                                    onClick={() => setSelectedNotification(notification)}
                                    sx={{
                                        cursor: 'pointer',
                                        backgroundColor: notification.read ? 'inherit' : 'rgba(0,0,0,0.1)',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(0,0,0,0.1)',
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
                                        secondary={notification.message}
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
            </Drawer>

            <NotificationDetails
                open={Boolean(selectedNotification)}
                onClose={handleDetailsClose}
                notification={selectedNotification}
            />
        </Box>
    );
};

export default NotificationPopupMenu;
