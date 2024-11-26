import React, { useState, useEffect } from 'react';
import {
    Box, Container, Grid, Typography, FormControl, InputLabel,
    Select, MenuItem, TextField, Button, Paper, List, ListItem,
    ListItemText, ListItemIcon, Divider, Tooltip, CircularProgress,
    FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import { Call, CalendarToday, CheckCircle, Send, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { format, getTime } from 'date-fns';
import bookingService from '../../services/bookingService';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import { useClinicContext } from '../../contexts/ClinicContext';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../services/axiosInstance';
import notificationService from '../../services/notificationService';
import SuccessMessage from '../common/SuccessMessage';

const AppointmentSection = () => {
    const { mode } = useCustomTheme();
    const { user } = useAuth();
    const { clinicInfo } = useClinicContext();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const isDark = mode === 'dark';
    const showSnackbar = useSnackbar();

    const [formData, setFormData] = useState({
        service: '',
        name: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        message: '',
        user: user?._id || null,
    });
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [onlineTimes, setOnlineTimes] = useState([]);
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleDateSelectionChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        const selectedDate = new Date(value);
        const onlineTime = clinicInfo.onlineTimes?.find((time) => time.day.toLowerCase() === format(selectedDate, 'eeee').toLowerCase());
        if (onlineTime) {
            const from = new Date(`01/01/2000 ${onlineTime.from}`);
            const to = new Date(`01/01/2000 ${onlineTime.to}`);
            const slots = [];
            while (from < to) {
                slots.push(format(from, 'hh:mm a'));
                from.setMinutes(from.getMinutes() + 30);
            }
            setOnlineTimes(slots);
        } else {
            setOnlineTimes([]);
        }
    };


    const validateFormData = () => {
        if (!formData.name || !formData.phone || !formData.service || !formData.date || !formData.time) {
            return isArabic ? 'يجب ملْ كل الحقول المطلوبة' : 'Please enter all required fields';
        }
        if (!/^(010|011|012|015)[0-9]{8}$/.test(formData.phone)) {
            return isArabic ? 'يرجى ادخال رقم الهاتف المصري صالح' : 'Please enter a valid Egyptian phone number.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const errorMsg = validateFormData();
        if (errorMsg) {
            showSnackbar(errorMsg, 'error');
            setLoading(false);
            return;
        }

        try {
            const data = await bookingService.createBooking(bookingData);
            if (data) {
                handleAddNotification(data?._id, 'info');
            }
            showSnackbar(isArabic ? 'تم حجز الموعد بنجاح' : 'Appointment booked successfully', 'success');
            setIsSuccess(true);
        } catch (error) {
            console.error('Failed to create booking:', error);
            showSnackbar(isArabic ? 'حدث خطأ أثناء حجز الموعد' : 'An error occurred while creating an appointment', 'error');
            handleAddNotification('', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNotification = async (refId = '', type = 'info') => {
        try {
            const notificationData = {
                title: 'New Appointment',
                message: type === 'info' ? 'A new appointment has been created.' : 'An error occurred while creating an appointment.',
                type: type,
                ref: 'OnlineBooking',
                refId: refId,
            };
            await notificationService.createNotification(notificationData);
        } catch (error) {
            console.error('Failed to add notification:', error);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                setIsSuccess(false);
                setFormData({
                    service: '',
                    name: '',
                    phone: '',
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    message: '',
                    user: user?._id || null,
                });
            }, 20000);
            return () => clearTimeout(timer);
        }

    }, [isSuccess]);

    useEffect(() => {
        fetchServices();
        fetchBookings();
    }, []);

    const fetchServices = async () => {
        try {
            const { data } = await axiosInstance.get('/services');
            setServices(data);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        }
    };

    const fetchBookings = async () => {
        try {
            const { data } = await bookingService.getAllBookings();
            const feuturesData = data.filter((booking) => new Date(booking.date) >= new Date());
            setBookings(feuturesData);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        }
    }

    const usableTime = (time) => {
        if (formData.date === '') return false;
        const times = bookings.filter((booking) => new Date(booking.date).toLocaleDateString() === new Date(formData.date).toLocaleDateString())
            .map((booking) => booking.time);
        return times.includes(time);
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                my: 5,
                color: 'text.primary',
                background: isDark
                    ? 'linear-gradient(135deg, #F95454, #F97373, #FFB6A6)'
                    : 'linear-gradient(45deg, #E1F5FE, #BBDEFB, #BBDEFB)',
                borderRadius: 2,
                boxShadow: 2,
                p: 4,
            }}
        >
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography variant="h4" mb={2} sx={{ fontWeight: 500 }}>{t('appointmentSection.emergency.title')}</Typography>
                        <Typography variant="body1" mb={2} sx={{ color: 'text.secondary' }}>{t('appointmentSection.emergency.description')}</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<Call sx={{ color: 'white', mr: 1, ml: 1, fontSize: '1.5rem' }} />}
                            href={`tel:${clinicInfo?.phone}`}
                            sx={{ mb: 2 }}
                        >
                            {t('appointmentSection.emergency.call')}{clinicInfo?.phone}
                        </Button>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                        <Typography variant="h5" mb={1} sx={{ fontWeight: 'bold' }}>{t('appointmentSection.openHours.title')}</Typography>
                        <Box>
                            {Object.keys(clinicInfo?.openHours || {}).map(day => (
                                <MenuItem key={day} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="h6" sx={{ color: 'text.secondary', width: '100px' }}>
                                        {`${t(`days.${day}`)} :`}
                                    </Typography>
                                    <Box style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                    }}>
                                        {!clinicInfo?.openHours[day]?.isClosed ? (
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Typography variant="body1" sx={{ color: 'text.primary', fontWight: 'bold' }}>
                                                    <span>{t('days.from')}</span> {clinicInfo?.openHours[day]?.from.toLowerCase().replace(/am|pm/g, (e) => t(`days.${e}`))}{' '}
                                                </Typography>
                                                {' - '}
                                                <Typography variant="body1" sx={{ color: 'text.primary', fontWight: 'bold' }}>
                                                    <span>{t('days.to')}</span> {clinicInfo?.openHours[day]?.to.toLowerCase().replace(/am|pm/g, (e) => t(`days.${e}`))}

                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="body1" sx={{ color: 'text.primary', fontWight: 'bold' }}>
                                                {t('days.closed')}
                                            </Typography>
                                        )}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Box>
                    </Box>
                </Grid>
                {isSuccess ? (
                    <Grid item xs={12} md={5}>
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    padding: 3,
                                    borderRadius: '12px',
                                    bgcolor: 'background.paper',
                                    position: 'relative',
                                }}
                            >
                                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                    <Tooltip title={t('appointmentSection.success.back')}>
                                        <Close color="info" sx={{ fontSize: '2rem' }} />
                                    </Tooltip>
                                </Box>
                                <SuccessMessage phone={clinicInfo?.phone} name={formData.name} date={formData.date} time={formData.time} />
                            </Paper>
                        </Box>
                    </Grid>
                ) : (
                    <Grid item xs={12} md={5}>
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    padding: 3,
                                    borderRadius: '12px',
                                    bgcolor: 'background.paper',
                                }}
                            >
                                <form onSubmit={handleSubmit}>
                                    <Typography variant="h5" mb={2} sx={{ fontWeight: 'bold', textAlign: 'center' }}>{t('appointmentSection.booking.title')}</Typography>
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <InputLabel id="service-label">{t('appointmentSection.booking.service')}</InputLabel>
                                        <Select
                                            fullWidth
                                            size="small"
                                            labelId="service-label"
                                            id="service"
                                            name="service"
                                            value={formData.service}
                                            onChange={handleInputChange}
                                            required
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>{isArabic ? 'اختر الخدمة' : 'Select Service'}</MenuItem>
                                            {services.map((service) => (
                                                <MenuItem key={service._id} value={service._id}>
                                                    {isArabic ? service.title.ar : service.title.en}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        size="small"
                                        label={t('appointmentSection.booking.name')}
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        size="small"
                                        label={t('appointmentSection.booking.phone')}
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        size="small"
                                        label={t('appointmentSection.booking.date')}
                                        name="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={handleDateSelectionChange}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <InputLabel id="time-label">{t('appointmentSection.booking.time')}</InputLabel>
                                        <Select
                                            fullWidth
                                            size="small"
                                            labelId="time-label"
                                            id="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            required
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>{isArabic ? 'اختر الوقت المناسب' : 'Select Prefer Time'}</MenuItem>
                                            {onlineTimes?.map((time, index) => (
                                                <MenuItem key={index} value={time} disabled={usableTime(time)}>
                                                    {time} - {usableTime(time) ? t('appointmentSection.booking.unavailable') : t('appointmentSection.booking.available')}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        size="small"
                                        label={t('appointmentSection.booking.message')}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        sx={{ mb: 2 }}
                                    />
                                    <Box display="flex" justifyContent="center">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            startIcon={loading ? <CircularProgress size={20} /> : <Send sx={{ fontSize: '1.5rem', ml: 2, mr: 2 }} />}
                                            disabled={loading}
                                        >
                                            {t('appointmentSection.booking.submit')}
                                        </Button>
                                    </Box>
                                </form>
                            </Paper>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default AppointmentSection;
