import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
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
                const response = await axiosInstance.get('/subscribe');
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
        { field: 'subscriptionDate', headerName: 'Date Subscribed', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box p={3}>
                <Typography variant="h4" gutterBottom>
                    Manage Subscriptions
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ height: 400, width: '100%', mt: 3 }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            loading={loading}
                            rowsPerPageOptions={[5, 10, 20]}
                            checkboxSelection
                            disableSelectionOnClick
                        />
                    </Box>
                </motion.div>
            </Box>
        </motion.div>
    );
};

export default ManageSubscriptionsPage;
