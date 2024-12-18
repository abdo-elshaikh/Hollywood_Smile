import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, CardContent, CircularProgress, TextField, Button,
    Grid, Container, CardActions, Chip, Divider,
    List, ListItem, ListItemText, ListItemIcon,
    Avatar, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Restore, Cancel, Pending, Loop, ThumbUpAlt, Done, DoneAll, WatchLater } from '@mui/icons-material';
import bookingService from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarProvider';
import { useTranslation } from 'react-i18next';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import ServicesSection from '../components/home/ServicesSection';
import OffersSection from '../components/home/OffersSection';
import MapLocationSection from '../components/home/MapLocationSection';
import headerVideo from '../assets/videos/detect-booking.mp4';

const ClientBookings = () => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const showSnackbar = useSnackbar();
    const isArabic = i18n.language === 'ar';

    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const steps = {
        'Pending': { label: t('detect.pending'), icon: <WatchLater /> },
        'Confirmed': { label: t('detect.confirmed'), icon: <ThumbUpAlt /> },
        'In Progress': { label: t('detect.inProgress'), icon: <Loop /> },
        'Completed': { label: t('detect.completed'), icon: <DoneAll /> },
        'Cancelled': { label: t('detect.cancelled'), icon: <Cancel /> }
    }

    const handleOpenDialog = (booking) => {
        setSelectedBooking(booking);
    };

    const handleCloseDialog = () => {
        setSelectedBooking(null);
    };

    const bookStatusColor = (status) => {
        switch (status) {
            case "In Progress":
                return "#FFA500";
            case "Cancelled":
                return "#DC3545";
            case "Pending":
                return "#007BFF";
            case "Confirmed":
                return "#28A745";
            case "Completed":
                return "#198754";
            default:
                return "#6C757D";
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await bookingService.getBookingsByClient(user._id);
            const bookings = data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            if (data.success) {
                setBookings(bookings);
                setFilteredBookings(bookings);
            }
        } catch (error) {
            showSnackbar(t('error.fetchBookings'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async () => {
        if (selectedBooking) {
            setUpdatingStatus(true);
            try {
                const data = await bookingService.updateBooking(selectedBooking._id, { status: 'Cancelled' });
                if (data.success) {
                    showSnackbar(t('detect.bookingCancelled'), 'info');
                    fetchBookings();
                    handleCloseDialog();
                }
            } catch (error) {
                showSnackbar(t('error.statusChange'), 'error');
            } finally {
                setUpdatingStatus(false);
            }
        }
    };

    useEffect(() => {
        if (user) fetchBookings();
    }, [user]);

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearch(searchValue);

        // If search is empty, show all bookings
        if (!searchValue) {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(
                bookings.filter(booking =>
                    booking.service.title[i18n.language].toLowerCase().includes(searchValue) ||
                    booking.date.toLowerCase().includes(searchValue)
                )
            );
        }
    };

    return (
        <Box>
            <HeaderSection />
            <Box
                sx={{
                    position: 'relative',
                    height: '70vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <video
                    src={headerVideo}
                    autoPlay
                    loop
                    muted
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: -1
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        textAlign: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        p: 5
                    }}
                />
            </Box>
            <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', py: 5, backdropFilter: 'blur(20px)', px: 6 }}>
                <Typography variant="h3">{t('detect.title')}</Typography>
                <Typography variant="h5">{t('detect.description')}</Typography>
            </Box>
            <Box component={Container} maxWidth='lg' sx={{ position: 'relative', py: 5, overflow: 'auto', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)' }}>{t('detect.clientInfo')}</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Avatar src={user?.avatarUrl} sx={{ width: 100, height: 100, m: 2 }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="h6" color='#222'>
                                    {t('detect.name')} :
                                    <Typography variant="body1" component="span" sx={{ fontWeight: 'normal', color: '#222' }}> {user?.name}</Typography>
                                </Typography>
                            }
                            secondary={
                                <Typography variant="h6" color='#222'>
                                    {t('detect.email')} :
                                    <Typography variant="body1" component="span" sx={{ fontWeight: 'normal', color: '#222' }}> {user?.email}</Typography>
                                </Typography>
                            }
                            sx={{ ml: 2, textAlign: isArabic ? 'right' : 'left', color: '#222' }}
                        />
                    </ListItem>
                </List>

                {/* Search and Refresh Button */}
                <Box
                    sx={{
                        mb: 3,
                        display: 'flex',
                        gap: 2,
                        flexDirection: isArabic ? 'row-reverse' : 'row',
                        p: 2,
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 2
                    }}
                >
                    <TextField
                        size="small"
                        variant="outlined"
                        label={t('detect.search')}
                        value={search}
                        onChange={handleSearch}
                    />
                    <TextField
                        size="small"
                        variant="outlined"
                        type="date"
                        value={search}
                        onChange={handleSearch}
                    />

                    <Button
                        variant="text"
                        color="primary"
                        onClick={fetchBookings}
                        startIcon={<Restore sx={{ mr: 2, ml: 2 }} />}
                    >
                        {t('detect.refresh')}
                    </Button>
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)' }}>{t('detect.bookings')}</Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                                <Grid item xs={12} key={booking._id}>
                                    <Card elevation={5} sx={{ mb: 2, position: 'relative', bgcolor: 'background.paper' }}>
                                        <Chip
                                            label={t('detect.bookingNo') + ' : ' + booking.code}
                                            sx={{
                                                backgroundColor: 'background.default',
                                                color: 'white',
                                                boxShadow: '0 0 5px 0',
                                                fontWeight: 'bold',
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                m: 2
                                            }}
                                        />
                                        <Chip
                                            label={`${t('detect.bookingStatus')} : ${t('detect.' + booking.status.toLowerCase())}`}
                                            sx={{
                                                backgroundColor: bookStatusColor(booking.status),
                                                color: 'white',
                                                boxShadow: '0 0 5px 0',
                                                fontWeight: 'bold',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                m: 2
                                            }}
                                        />
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    width: '100%',
                                                    flexDirection: { xs: 'column', md: 'row' },
                                                    alignItems: 'center',
                                                    mb: 1,
                                                    mt: 6
                                                }}>
                                                {Object.keys(steps).map((key, index) => (
                                                    <Box key={index}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: { xs: 'flex-start', md: 'center' },
                                                            width: '100%',
                                                            flexDirection: { xs: 'row', md: 'column' },
                                                            bgcolor: booking.status === key ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                                                            boxShadow: booking.status === key ? '0 0 3px 0' : 'none',
                                                            borderRadius: 2,
                                                            gap: 2,
                                                            p: 1,
                                                        }}
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                backgroundColor: bookStatusColor(key), color: 'white',
                                                                width: 50, height: 50,
                                                                boxShadow: 2,
                                                                border: (key === booking.status) ? '3px solid' : 'none',
                                                                bordercolor: (key === booking.status) ? 'primary.main' : 'transparent'
                                                            }}
                                                        >
                                                            {steps[key].icon}
                                                        </Avatar>
                                                        <Typography variant="body1" fontWeight="bold" >{steps[key].label}</Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                            <Divider variant="fullWidth" sx={{ mb: 2 }} />
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                flexDirection: 'column',
                                                mb: 2,
                                                gap: 1
                                            }}>
                                                <Typography>{t('detect.service')} : {booking.service.title[i18n.language]}</Typography>
                                                <Typography>{t('detect.date')} : {new Date(booking.date).toLocaleDateString()}</Typography>
                                                <Typography>{t('detect.time')} : {booking.time}</Typography>
                                            </Box>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'center' }}>
                                            {booking.status === 'Pending' && (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<Cancel />}
                                                    disabled={booking.status !== 'Pending'}
                                                    onClick={() => handleOpenDialog(booking)}
                                                >
                                                    {t('detect.cancelBooking')}
                                                </Button>
                                            )}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="h6" color="textSecondary">{t('detect.noBookings')}</Typography>
                        )}
                    </Grid>
                )}

                <Dialog open={!!selectedBooking} onClose={handleCloseDialog}>
                    <DialogTitle>{isArabic ? 'إلغاء الحجز' : 'Cancel Booking'}</DialogTitle>
                    <DialogContent>
                        {selectedBooking && (
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography>
                                    {isArabic ? 'كود الحجز' : 'Booking Code'} : {selectedBooking.code}
                                </Typography>
                                <Typography>{t('detect.service')} : {selectedBooking.service.title[i18n.language]}</Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
                        <Button
                            onClick={handleStatusChange}
                            color="error"
                            disabled={updatingStatus}
                        >
                            {isArabic ? 'إلغاء الحجز' : 'Cancel Booking'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box sx={{ backgroundColor: 'background.default' }}>
                <OffersSection />
                <MapLocationSection />
            </Box>
            <Footer />
            <ScrollToTopButton />
        </Box>
    );
};

export default ClientBookings;
