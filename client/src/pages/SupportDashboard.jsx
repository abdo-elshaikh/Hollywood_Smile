import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Toolbar,
    IconButton,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Button,
    useTheme,
    useMediaQuery,
    Tooltip,
    CircularProgress,
    Container,
} from '@mui/material';
import { Refresh, BarChart, BookOnline, DarkMode, LightMode, Home, LoginOutlined } from '@mui/icons-material';
import ManageBookingsPage from '../components/dashboard/ManageBookingsPage';
import bookingService from '../services/bookingService';
import { useSnackbar } from '../contexts/SnackbarProvider';
import { useCustomTheme } from '../contexts/ThemeProvider';
import { Navigate } from 'react-router-dom';
import MessagePopupMenu from '../components/common/MessagePopupMenu';
import NotificationPopupMenu from '../components/common/NotificationPopupMenu';
import { useAuth } from '../contexts/AuthContext';

const SupportDashboard = () => {
    document.body.dir = 'ltr';
    const theme = useTheme();
    const { user, logout } = useAuth();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { mode, toggleMode } = useCustomTheme();
    const [bookings, setBookings] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);

    const handleToggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getAllBookings();
            setBookings(data.data);
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "Error fetching bookings.", "error");
        } finally {
            setLoading(false);
        }
    }

    const [loading, setLoading] = useState(false);

    const showSnackbar = useSnackbar();

    const pendingBookings = bookings.filter((booking) => booking.status === 'Pending').length;
    const totalBookings = bookings.length;
    const cancelledBookings = bookings.filter((booking) => booking.status === 'Cancelled').length;

    const thisWeek = new Date(new Date().setDate(new Date().getDate() - 7));
    const lastWeek = new Date(new Date().setDate(new Date().getDate() - 14));

    const bookingsThisWeek = bookings.filter((booking) => new Date(booking.createdAt) > thisWeek);
    const bookingsLastWeek = bookings.filter((booking) => new Date(booking.createdAt) > lastWeek);

    const totalThisWeek = bookingsThisWeek.length;
    const totalLastWeek = bookingsLastWeek.length;

    const cancelledThisWeek = bookingsThisWeek.filter((booking) => booking.status === 'Cancelled').length;
    const cancelledLastWeek = bookingsLastWeek.filter((booking) => booking.status === 'Cancelled').length;

    const completedThisWeek = bookingsThisWeek.filter((booking) => booking.status === 'Completed').length;
    const completedLastWeek = bookingsLastWeek.filter((booking) => booking.status === 'Completed').length;

    return (
        <Box
            sx={{
                padding: 4,
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
            }}
        >
            {/* Header */}
            <Container
                maxWidth="xl"
                sx={{
                    position: 'fixed',
                    top: 20,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                }}
            >
                <Toolbar
                    variant="dense"
                    sx={{
                        justifyContent: 'space-between',
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        boxShadow: theme.shadows[3],
                        padding: { xs: 1, sm: 2 },
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                    }}
                >
                    <Typography variant={isMobile ? 'h6' : 'h4'} fontWeight="bold">
                        Support Dashboard
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title="Refresh" arrow>
                            <IconButton onClick={fetchBookings} aria-label="refresh">
                                <Refresh color="primary" />
                            </IconButton>
                        </Tooltip>
                        <NotificationPopupMenu source='support-dashboard' />
                        <MessagePopupMenu source='support-dashboard' />
                        <Tooltip title="Change Theme" arrow>
                            <IconButton onClick={toggleMode} aria-label="toggle-dark-mode">
                                {mode === 'dark' ? <LightMode /> : <DarkMode />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Home" arrow>
                            <IconButton href="/" aria-label="home">
                                <Home />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Logout" arrow>
                            <IconButton onClick={logout} aria-label="logout">
                                <LoginOutlined color="error" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>

            {/* Overview Cards */}
            < Grid container spacing={4} sx={{ mb: 4, mt: 10 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderLeft: `5px solid ${theme.palette.success.main}` }}>
                        <CardHeader
                            avatar={<BarChart fontSize="large" color="success" />}
                            title="Total Bookings"
                            subheader={`${totalThisWeek} This Week | ${totalLastWeek} Last Week`}
                            sx={{ textAlign: 'center' }}
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight="bold">
                                {totalBookings}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Total bookings received so far
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ borderLeft: `5px solid ${theme.palette.info.main}` }}>
                        <CardHeader
                            avatar={<BookOnline fontSize="large" color="info" />}
                            title="Pending Bookings"
                            subheader={`${completedThisWeek} completed This Week | ${completedLastWeek} completed Last Week`}
                            sx={{ textAlign: 'center' }}
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight="bold">
                                {pendingBookings}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Bookings awaiting action
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ borderLeft: `5px solid ${theme.palette.error.main}` }}>
                        <CardHeader
                            avatar={<BarChart fontSize="large" color="error" />}
                            title="Cancelled Bookings"
                            subheader={`${cancelledThisWeek} This Week | ${cancelledLastWeek} Last Week`}
                            sx={{ textAlign: 'center' }}
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight="bold">
                                {cancelledBookings}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Total bookings cancelled
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid >

            {/* Manage Bookings Section */}
            < Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    padding: 1,
                    boxShadow: theme.shadows[3],
                }}
            >
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',

                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <ManageBookingsPage />
                )}
            </Box>
        </Box>
    );
};

export default SupportDashboard;
