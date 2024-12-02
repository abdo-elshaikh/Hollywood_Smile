import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/axiosInstance';

const ManageSubscriptionsPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch subscriptions from the backend
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axiosInstance.get('/subscribers');
                setSubscriptions(response.data.subscribers);
            } catch (error) {
                console.error('Failed to fetch subscriptions:', error);
                setError('Failed to load subscriptions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, []);

    const rows = subscriptions.map((subscription, index) => ({
        id: index + 1,
        email: subscription.email,
        subscriptionDate: new Intl.DateTimeFormat('en-US').format(new Date(subscription.createdAt)),
    }));

    // Columns configuration for DataGrid
    const columns = [
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'subscriptionDate', headerName: 'Date Subscribed' },
        {
            field: 'actions',
            headerName: 'Actions',
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubscriptionAction(params.row)}
                >
                    Manage
                </Button>
            ),
        },
    ];

    const handleSubscriptionAction = (subscription) => {
        // Implement subscription management logic here
        alert(`Manage subscription for: ${subscription.email}`);
    };

    return (
        <Box >
            {error && <Alert severity="error">{error}</Alert>}
            {loading ? (
                <CircularProgress />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ height: 400, width: '100%', overflowX: 'auto' }}
                >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                    />
                </motion.div>
            )}
        </Box>
    );
};

export default ManageSubscriptionsPage;
