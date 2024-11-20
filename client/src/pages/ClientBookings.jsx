import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, CardContent, CircularProgress, TextField, Button,
    Stepper, Step, StepLabel, Grid, Container, CardActions, Chip, StepConnector, Divider,
    List, ListItem, ListItemText, ListItemIcon, Avatar, Dialog, DialogTitle, DialogContent, DialogActions
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
    const [openDialog, setOpenDialog] = useState(false);

    const steps = {
        'Pending': { label: t('detect.pending'), icon: <WatchLater /> },
        'Confirmed': { label: t('detect.confirmed'), icon: <ThumbUpAlt /> },
        'In Progress': { label: t('detect.inProgress'), icon: <Loop /> },
        'Completed': { label: t('detect.completed'), icon: <DoneAll /> },
        'Cancelled': { label: t('detect.cancelled'), icon: <Cancel /> }
    }

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const bookStatusColor = (status) => {
        switch (status) {
            case "In Progress":
                return "secondary";
            case "Cancelled":
                return "error";
            case "Pending":
                return "warning";
            case "Confirmed":
                return "info";
            case "Completed":
                return "success";
            default:
                return "default";
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

    const handleStatusChange = async (bookingId) => {
        setUpdatingStatus(true);
        try {
            const data = await bookingService.updateBooking(bookingId, { status: 'Cancelled' });
            if (data.success) {
                showSnackbar(t('detect.bookingCancelled'), 'info');
                fetchBookings();
            }
        } catch (error) {
            showSnackbar(t('error.statusChange'), 'error');
        } finally {
            setUpdatingStatus(false);
        }
    };

    useEffect(() => {
        if (user) fetchBookings();
    }, [user]);

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearch(searchValue);
        setFilteredBookings(
            bookings.filter(booking =>
                booking.service.title[i18n.language].toLowerCase().includes(searchValue) ||
                booking.date.toLowerCase().includes(searchValue)
            )
        );
    };

    return (
        <Box>
            <HeaderSection />
            <Box section
                sx={{
                    position: 'relative',
                    height: '85vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Typography variant="h3">{t('detect.title')}</Typography>
                <Typography variant="h5">{t('detect.description')}</Typography>
                <Box
                    component="video"
                    src={headerVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: -1,
                        filter: 'brightness(50%)'
                    }}
                />
            </Box>
            <Box component={Container} maxWidth='lg' sx={{ position: 'relative', py: 5, overflow: 'auto' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{t('detect.clientInfo')}</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Avatar src={user?.avatarUrl} sx={{ width: 100, height: 100, m: 2 }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="h6">
                                    {t('detect.name')} :
                                    <Typography variant="body1" component="span" sx={{ fontWeight: 'normal' }}> {user?.name}</Typography>
                                </Typography>
                            }
                            secondary={
                                <Typography variant="h6">
                                    {t('detect.email')} :
                                    <Typography variant="body1" component="span" sx={{ fontWeight: 'normal' }}> {user?.email}</Typography>
                                </Typography>
                            }
                            sx={{ ml: 2, textAlign: isArabic ? 'right' : 'left' }}
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
                        label={t('detect.date')}
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

                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>{t('detect.bookings')}</Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking, index) => (
                                <Grid item xs={12} key={booking._id}>
                                    <Card elevation={4} sx={{ mb: 2, position: 'relative' }}>
                                        <Chip
                                            label={t('detect.bookingNo') + ' ' + (index + 1)}
                                            color="primary"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                m: 2
                                            }}
                                        />
                                        <Chip
                                            label={`${t('detect.bookingStatus')} : ${`${t('detect.' + booking.status.toLowerCase())}`}`}
                                            color={bookStatusColor(booking.status)}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                m: 2
                                            }}
                                        />
                                        <CardContent>

                                            <Stepper
                                                activeStep={steps[booking.status].label}
                                                alternativeLabel
                                                connector={false}
                                                id="stepper"
                                                sx={{
                                                    backgroundColor: 'background.default',
                                                    py: 3,
                                                    borderRadius: 2,
                                                    mb: 2,
                                                    mt: 4,
                                                }}

                                            >
                                                {Object.keys(steps).map((status) => (
                                                    <Step key={status}>
                                                        <StepLabel
                                                            icon={steps[status].icon}
                                                            sx={{
                                                                '& .MuiStepLabel-label': {
                                                                    fontSize: '1.2rem',
                                                                    fontWeight: 'bold',
                                                                    color: booking.status === status ? '#7ED4AD' : 'inherit'
                                                                },
                                                                '& .MuiStepLabel-iconContainer': {
                                                                    border: '2px solid',
                                                                    borderRadius: '50%',
                                                                    padding: 1,
                                                                    borderColor: bookStatusColor(status),
                                                                    backgroundColor: booking.status === status ? '#7ED4AD' : 'transparent',
                                                                    opacity: booking.status === status ? 1 : 0.7
                                                                }
                                                            }}
                                                        >
                                                            <Typography variant="h6" fontWeight='bold' >{steps[status].label}</Typography>
                                                        </StepLabel>
                                                    </Step>
                                                ))}
                                            </Stepper>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 2,
                                                    gap: 2
                                                }}
                                            >
                                                <Typography >{t('detect.service')} : {booking.service.title[i18n.language]}</Typography>
                                                <br />
                                                <Typography >{t('detect.date')} : {new Date(booking.date).toLocaleDateString()}</Typography>
                                                <br />
                                                <Typography >{t('detect.time')} : {booking.time}</Typography>
                                            </Box>
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={handleOpenDialog}
                                                disabled={booking.status === 'Cancelled' || updatingStatus}
                                                startIcon={<Cancel sx={{ mr: 2, ml: 2 }} />}
                                            >
                                                {booking.status === 'Cancelled' ? t('detect.bookingCancelled') : updatingStatus ? <CircularProgress size={20} color="inherit" /> : t('detect.cancelBooking')}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                                        <DialogTitle>{t('detect.cancelBooking')}</DialogTitle>
                                        <DialogContent>{t('detect.cancelBookingMsg')}</DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseDialog} color="primary">{t('detect.no')}</Button>
                                            <Button onClick={() => handleStatusChange(booking._id)} color="error">{t('detect.yes')}</Button>
                                        </DialogActions>
                                    </Dialog>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography align="center" variant="body1">{t('detect.noBookings')}</Typography>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Box>

            <ServicesSection />
            <OffersSection />
            <MapLocationSection />
            <Footer />
            <ScrollToTopButton />
        </Box>
    );
};

export default ClientBookings;
