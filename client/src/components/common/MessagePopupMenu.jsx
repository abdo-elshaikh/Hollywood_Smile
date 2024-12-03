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
    Skeleton,
} from '@mui/material';
import { Message, ClearAllTwoTone } from '@mui/icons-material';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import MessageDetails from './MessageDetails';

const MessagePopupMenu = ({ source = 'admin-dashboard' }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setFetching(true);
        try {
            const response = await axiosInstance.get('/messages');
            const sortedMessages = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMessages(sortedMessages);
            setUnreadCount(sortedMessages.filter((msg) => !msg.read).length);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewAllMessages = () => {
        if (source === 'admin-dashboard') {
            navigate('/dashboard/messages');
        } else {
            setDrawerOpen(true);
        }
        handleMenuClose();
    };

    const handleViewMessageDetails = (message) => {
        setSelectedMessage(message);
    };

    const handleDetailsClose = () => {
        setSelectedMessage(null);
        fetchMessages();
    };

    const handleClearAll = async () => {
        setLoading(true);
        try {
            await Promise.all(
                messages.map((msg) =>
                    !msg.read ? axiosInstance.put(`/messages/${msg._id}/read`) : Promise.resolve()
                )
            );
            fetchMessages();
        } catch (error) {
            console.error('Failed to clear messages:', error);
        } finally {
            setLoading(false);
            handleMenuClose();
        }
    };

    return (
        <Box>
            {/* Message Icon Button */}
            <Tooltip title="Messages" arrow>
                <IconButton onClick={handleMenuClick}>
                    <Badge badgeContent={unreadCount} color="secondary">
                        <Message />
                    </Badge>
                </IconButton>
            </Tooltip>

            {/* Message Menu */}
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <Box sx={{ padding: 2, width: 300 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="bold">
                            Messages
                        </Typography>
                        <Tooltip title="Mark all as read">
                            <IconButton onClick={handleClearAll} disabled={loading}>
                                {loading ? <CircularProgress size={20} /> : <ClearAllTwoTone />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Divider sx={{ marginY: 1 }} />
                    <List>
                        {fetching ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <ListItem key={index}>
                                    <Skeleton variant="text" width="80%" />
                                </ListItem>
                            ))
                        ) : messages.length > 0 ? (
                            messages.slice(0, 5).map((msg) => (
                                <ListItem
                                    key={msg._id}
                                    button
                                    onClick={() => handleViewMessageDetails(msg)}
                                    sx={{
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: 4,
                                            height: '100%',
                                            backgroundColor: msg.read ? 'transparent' : 'primary.main',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            height: '100%',
                                            backgroundColor: msg.read ? 'transparent' : 'rgb(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    <Badge
                                        badgeContent={!msg.read ? 'New' : null}
                                        color="primary"
                                        sx={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                        }}
                                    />
                                    <ListItemText
                                        primary={msg.name}
                                        secondary={`${msg.message.slice(0, 40)}...`}
                                        primaryTypographyProps={{
                                            variant: 'body1',
                                            fontWeight: msg.read ? 'normal' : 'bold',
                                        }}
                                        secondaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No messages available." />
                            </ListItem>
                        )}
                    </List>
                </Box>
                <Divider />
                <MenuItem onClick={handleViewAllMessages}>View All Messages</MenuItem>
            </Menu>

            {/* Drawer for Mobile View */}
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 400, px: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Messages
                    </Typography>
                    <Divider sx={{ marginY: 1 }} />
                    <List
                        sx={{
                            height: 'calc(100vh - 64px)',
                            overflowY: 'scroll',
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
                        {fetching ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <ListItem key={index}>
                                    <Skeleton variant="text" width="80%" />
                                </ListItem>
                            ))
                        ) : messages.length > 0 ? (
                            messages.map((msg) => (
                                <ListItem
                                    key={msg._id}
                                    button
                                    onClick={() => handleViewMessageDetails(msg)}
                                    sx={{
                                        position: 'relative',
                                        borderBottom: '1px solid ',
                                        borderColor: 'primary.light',
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: 4,
                                            height: '100%',
                                            backgroundColor: msg.read ? 'transparent' : 'primary.main',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            height: '100%',
                                            backgroundColor: msg.read ? 'transparent' : 'rgb(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    <Badge
                                        badgeContent={!msg.read ? 'New' : null}
                                        color="primary"
                                        sx={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                        }}
                                    />
                                    <ListItemText
                                        primary={msg.name}
                                        secondary={`${msg.message.slice(0, 100)}...`}
                                        primaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
                                        secondaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No messages available." />
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>

            {/* Message Details Dialog */}
            {selectedMessage && (
                <MessageDetails
                    message={selectedMessage}
                    open={Boolean(selectedMessage)}
                    onClose={handleDetailsClose}
                />
            )}
        </Box>
    );
};

export default MessagePopupMenu;
