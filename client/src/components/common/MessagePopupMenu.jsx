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
} from '@mui/material';
import { Message, ClearAllTwoTone } from '@mui/icons-material';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import MessageDetails from './MessageDetails';

const MessagePopupMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axiosInstance.get('/messages');
            const unreadMessages = response.data.filter((message) => !message.read).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMessages(unreadMessages);
            setUnreadCount(unreadMessages.length);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewAllMessages = () => {
        navigate('/dashboard/messages');
        handleMenuClose();
    };

    const handleViewMessageDetails = (message) => {
        setSelectedMessage(message);
    };

    const handleDetailsClose = () => {
        setSelectedMessage(null);
        handleMenuClose();
        fetchMessages();
    };

    useEffect(() => {
        fetchMessages();
    }, [selectedMessage]);

    const handleClearAll = async () => {
        try {
            // await axiosInstance.delete('/messages');
            setMessages([]);
            setUnreadCount(0);
            handleMenuClose();
        } catch (error) {
            console.error('Failed to clear messages:', error);
        }
    };

    return (
        <Box>
            <Tooltip title="Messages" onClick={handleMenuClick} arrow>
                <IconButton color="inherit" sx={{ ml: 1 }}>
                    <Badge badgeContent={unreadCount} color="secondary">
                        <Message />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <Box sx={{ padding: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Messages</Typography>
                        <Tooltip title="Clear All">
                            <IconButton onClick={handleMenuClose}>
                                <ClearAllTwoTone />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Divider />
                    <List>
                        {messages.length > 0 ? (
                            messages.slice(0, 5).map((message) => (
                                <ListItem
                                    button
                                    key={message._id}
                                    onClick={() => handleViewMessageDetails(message)}
                                    sx={{ cursor: 'pointer', position: 'relative' }}

                                >
                                    <Badge
                                        badgeContent={message.read ? null : 'New'}
                                        color="primary"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 10,
                                            transform: 'translate(50%, -50%)',
                                        }}
                                    />
                                    <ListItemText
                                        primary={message.name}
                                        secondary={message.message.slice(0, 40) + '...'}
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
