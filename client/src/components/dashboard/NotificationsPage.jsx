import React, { useEffect, useState } from 'react';
import { Container, Typography, IconButton, Tooltip, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete, Visibility } from '@mui/icons-material';
import notificationService from '../../services/notificationService';
import { useSnackbar } from '../../contexts/SnackbarProvider';

const ManageNotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const showSnackbar = useSnackbar();

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
                        <IconButton onClick={() => alert(`Viewing notification: ${params.row.title}`)}>
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
        <Box sx={{ mt: 5, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Manage Notifications
            </Typography>
            <Box sx={{ height: 500, width: '100%' }}>
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
            </Box>
        </Box>
    );
};

export default ManageNotificationsPage;
