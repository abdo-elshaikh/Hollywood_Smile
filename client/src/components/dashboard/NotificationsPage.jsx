import React, { useEffect, useState } from 'react';
import { Container, Typography, IconButton, Tooltip, Box, List, ListItem, ListItemText, CircularProgress, ListItemIcon, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete, Visibility } from '@mui/icons-material';
import notificationService from '../../services/notificationService';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import NotificationDetails from '../common/NotificationDetails';

const ManageNotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const showSnackbar = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleView = (notification) => {
        setSelectedNotification(notification);
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setSelectedNotification(null);
        setOpenDialog(false);
    }


    // Fetch notifications from backend
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await notificationService.getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };
        fetchNotifications();
    }, []);

    // Handle delete notification
    const handleDelete = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications((prev) => prev.filter((notification) => notification._id !== id));
            showSnackbar('Notification deleted successfully', 'success');
        } catch (error) {
            showSnackbar('Error deleting notification', 'error');
            console.error('Failed to delete notification:', error);
        }
    };

    const columns = [
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'message', headerName: 'Message', flex: 1 },
        { field: 'type', headerName: 'Type', flex: 1 },
        { field: 'ref', headerName: 'Reference', flex: 1 },
        { field: 'refId', headerName: 'Reference ID', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <>
                    <Tooltip title="View">
                        <IconButton onClick={() => handleView(params.row)}>
                            <Visibility color="primary" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(params.row._id)}>
                            <Delete color="error" />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        },
    ];

    return (
        <Box >
            <Typography variant="h4" gutterBottom>
                Manage Notifications
            </Typography>
            <Box sx={{ height: 500, width: '100%', backgroundColor: 'background.default', overflow: 'auto' }}>
                {notifications.length === 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                )}
                {isMobile ? (
                    <List>
                        {notifications.map((notification) => (
                            <ListItem key={notification._id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid #ccc',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    borderRadius: 2,
                                }}>
                                <ListItemText primary={notification.title} secondary={notification.message} />
                                <ListItemIcon>
                                    <Tooltip title="View">
                                        <IconButton onClick={() => handleView(notification)}>
                                            <Visibility color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => handleDelete(notification._id)}>
                                            <Delete color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <DataGrid
                        rows={notifications}
                        columns={columns}
                        pageSize={10}
                        getRowId={(row) => row._id}
                        disableSelectionOnClick
                        autoHeight
                        density="compact"
                        sx={{ boxShadow: 2, borderRadius: 2, backgroundColor: 'background.paper' }}
                    />
                )}

                {selectedNotification && (
                    <NotificationDetails
                        notification={selectedNotification}
                        open={openDialog}
                        onClose={handleCloseDialog}
                    />
                )}
            </Box>
        </Box>
    );
};

export default ManageNotificationsPage;
