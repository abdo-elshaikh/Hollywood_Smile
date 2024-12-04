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
    TextField,
} from '@mui/material';
import { Email, Phone, Person, ChatBubble, CheckCircle, AccessTime } from '@mui/icons-material';
import axiosInstance from '../../services/axiosInstance';

const MessageDetails = ({ message, open, onClose }) => {

    const handleMarkAsReplied = async () => {
        try {
            await axiosInstance.put(`/messages/${message?._id}`, { replied: true });
            onClose();
        } catch (error) {
            console.error('Failed to mark as replied:', error);
        }
    };

    const handleReadMessage = async () => {
        try {
            await axiosInstance.put(`/messages/${message?._id}`, { read: true });
            onClose();
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
                Message Details
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    {/* Name */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <Person color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Name:</Typography>
                        <Typography variant="body1">{message?.name}</Typography>
                    </Box>

                    {/* Phone */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <Phone color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Phone:</Typography>
                        <Typography variant="body1">{message?.phone}</Typography>
                    </Box>

                    {/* Email */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <Email color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Email:</Typography>
                        <Typography variant="body1">{message?.email || 'N/A'}</Typography>
                    </Box>

                    {/* Time */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <AccessTime color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Time:</Typography>
                        <Typography variant="body1">{new Date(message?.createdAt).toLocaleString()}</Typography>
                    </Box>

                    <Divider />

                    {/* Message */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <ChatBubble color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Message:</Typography>
                    </Box>
                    <TextField
                        multiline
                        rows={4}
                        value={message?.message}
                        variant="outlined"
                        fullWidth
                        disabled
                        sx={{ backgroundColor: 'background.default', borderRadius: 1 }}
                    />

                    <Divider />

                    {/* Statuses */}
                    <Box display="flex" gap={2}>
                        <Chip
                            label={message?.read ? 'Read' : 'Unread'}
                            color={message?.read ? 'success' : 'warning'}
                            icon={message?.replied && <CheckCircle />}
                        />
                        <Chip
                            label={message?.replied ? 'Replied' : 'Not Replied'}
                            color={message?.replied ? 'primary' : 'default'}
                            icon={message?.replied && <CheckCircle />}
                        />
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                {!message?.replied && (
                    <Button variant="contained" color="primary" onClick={handleMarkAsReplied}>
                        Mark as Replied
                    </Button>
                )}

                {!message?.read && (
                    <Button variant="contained" color="primary" onClick={handleReadMessage}>
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

export default MessageDetails;
