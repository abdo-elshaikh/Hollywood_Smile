import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Container, Typography, Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Snackbar, IconButton, Card, CardContent, CardMedia, Badge, Divider, FormControl,
    InputLabel, Select, MenuItem,
} from '@mui/material';

import { ThumbUp, ThumbDown, Close } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import HeaderSection from '../components/home/HeaderSection';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import Footer from '../components/home/Footer';
import { useCustomTheme } from '../contexts/ThemeProvider';
import { useClinicContext } from '../contexts/ClinicContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../contexts/SnackbarProvider';
import bookingService from '../services/bookingService';
import onlineBookingVideo from '../assets/videos/onlineBooking.mp4';
import { useAuth } from '../contexts/AuthContext';
import SuccessMessage from "../components/common/SuccessMessage";
import axiosInstance from '../services/axiosInstance';
import MapLocationSection from '../components/home/MapLocationSection';
import FAQSection from '../components/home/FAQSection';
import notificationService from '../services/notificationService';

// date picker
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const BookingPage = () => {
    const { clinicInfo } = useClinicContext();
    const { mode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedService, setSelectedService] = useState({title: {en: '', ar: ''}});
    const [openDialog, setOpenDialog] = useState(false);

    const [currentDateTime, setCurrentDateTime] = useState({
        day: format(new Date(), 'eeee').toLowerCase()
            .replace(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/, (m) => t(`days.${m}`)),
        date: format(new Date(), 'dd/MM/yyyy'),
        time: format(new Date(), 'hh:mm:ss a').toLowerCase().replace(/am|pm/g, (m) => t(`days.${m}`)),
    });

    const [predefinedTimeSlots, setPredefinedTimeSlots] = useState([]);
    const navigate = useNavigate();
    const isDark = mode === 'dark';
    const showSnackBar = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const location = useLocation();
    const serviceId = location.state?.serviceId;
    const [bookingData, setBookingData] = useState({
        name: '', email: '', phone: '', service: serviceId || '',
        date: '', time: '', message: '', user: user?._id || null,
    });

    const handleSubmission = async () => {
        setLoading(true);
        if (!bookingData.name || !bookingData.phone || !bookingData.service || !bookingData.date || !bookingData.time) {
            showSnackBar(isArabic ? 'الرجاء ملء جميل الحقول المطلوبة!' : 'please fill all required fields !', 'error');
            setLoading(false);
            return;
        }
        try {
            const data = await bookingService.createBooking(bookingData);
            if (data) {
                handleAddNotification(data._id, 'info');
            }
            showSnackBar(isArabic ? 'تم حجز الموعد بنجاح' : 'Appointment booked successfully.', 'success');
            setSelectedDate(null);
            setSelectedTime('');
            setPredefinedTimeSlots([]);
            setOpenDialog(false);
            fetchBookings();
            setSuccess(true);
        } catch (error) {
            showSnackBar(isArabic ? 'حدث خطأ أثناء الحجز' : 'Error occurred during booking.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setSuccess(false);
    };

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                setSuccess(false);
                setBookingData({ name: '', email: '', phone: '', service: '', date: '', time: '', message: '', user: user?._id || null });
            }, 20000);
        }
    }, [success]);

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setBookingData({ ...bookingData, [name]: value });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentDay = format(now, 'eeee').toLowerCase().replace(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/, (m) => t(`days.${m}`));
            const currentDate = format(now, 'dd/MM/yyyy');
            const currentTime = format(now, 'hh:mm:ss a').toLowerCase().replace(/am|pm/g, (m) => t(`days.${m}`));
            setCurrentDateTime({
                day: currentDay,
                date: currentDate,
                time: currentTime,
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await bookingService.getAllBookings();
            const latestBookings = data.filter((booking) => new Date(booking.date) >= new Date());
            setBookings(latestBookings);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        }
    };

    const fetchServices = async () => {
        if (serviceId) {
            try {
                const response = await axiosInstance.get(`/services/${serviceId}`);
                console.log('response:', response.data);
                setSelectedService(response.data);
            } catch (error) {
                console.error('Failed to fetch service:', error);
            }
        } else {
            try {
                const response = await axiosInstance.get('/services');
                console.log('response:', response.data);
                setServices(response.data);
            } catch (error) {
                console.error('Failed to fetch services:', error);
            }
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchServices();
    }, []);

    const usableTime = (time) => {
        if (!selectedDate) return false;
        const times = bookings.filter((booking) => new Date(booking.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString())
            .map((booking) => booking.time);
        return times.includes(time);
    };

    const handleDateSelection = (date) => {
        if (date <= new Date()) {
            setSelectedTime('');
            showSnackBar(isArabic ? 'لا يمكن حجز موعد في هذا التاريخ' : 'Cannot book appointment on this date', 'error');
            return;
        }

        const selectedDay = format(date, 'eeee').toLowerCase();
        showSnackBar(isArabic ? `تم اختيار اليوم : ${t(`days.${selectedDay}`)}` : `Selected Day : ${t(`days.${selectedDay}`)}`, 'info');
        // console.log('date:', selectedDay);
        setSelectedDate(dayjs(date));
        setBookingData({ ...bookingData, date: date.toLocaleDateString() });
        const times = clinicInfo?.onlineTimes.find((time) => time.day.toLowerCase() === selectedDay);

        if (times) {
            const from = new Date(`01/01/2000 ${times.from}`);
            const to = new Date(`01/01/2000 ${times.to}`);
            const slots = [];
            while (from <= to) {
                slots.push(format(from, 'hh:mm a'));
                from.setMinutes(from.getMinutes() + 30);
            }
            setPredefinedTimeSlots(slots);
        } else {
            setPredefinedTimeSlots([]);
        }
    };

    const handleTimeSelection = (time) => {
        if (bookingData.service === '') {
            showSnackBar(isArabic ? 'الرجاء اختيار الخدمة أولاً' : 'Please select a service first', 'error');
            return;
        }
        setSelectedTime(time);
        setBookingData({ ...bookingData, time });
        setOpenDialog(true);
        showSnackBar(`Time selected: ${time}`, 'info');
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
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

    return (
        <Box>
            <HeaderSection />
            <Box
                position="relative"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '85vh',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <video
                    autoPlay
                    loop
                    muted
                    style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                >
                    <source src={onlineBookingVideo} type="video/mp4" />
                </video>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {isArabic ? 'حجز موعد' : 'Book Appointment'}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {isArabic ? 'احجز موعدك الآن' : 'Book your appointment now'}
                    </Typography>
                </Box>

                {/* Current Time Display */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        p: 2,
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {isArabic ? 'الوقت الحالي' : 'Current Time'}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                        {currentDateTime.day} : {currentDateTime.date} {' '} {currentDateTime.time}
                    </Typography>
                </Box>
            </Box>

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{isArabic ? 'حجز موعد' : 'Book Appointment'}</DialogTitle>
                <DialogContent>
                    <TextField
                        name="name"
                        label={isArabic ? 'الاسم' : 'Name'}
                        value={bookingData.name}
                        onChange={handleChangeInput}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="email"
                        label={isArabic ? 'البريد الإلكتروني (اختياري)' : 'Email(Optional)'}
                        value={bookingData.email}
                        onChange={handleChangeInput}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="phone"
                        label={isArabic ? 'رقم الهاتف' : 'Phone'}
                        value={bookingData.phone}
                        onChange={handleChangeInput}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="message"
                        label={isArabic ? ' الشكوى (اختياري)' : 'Complaint (Optional)'}
                        value={bookingData.message}
                        onChange={handleChangeInput}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={handleDialogClose} color="secondary">
                        {isArabic ? 'إلغاء' : 'Cancel'}
                    </Button>
                    <Button variant='outlined' onClick={handleSubmission} color="primary" disabled={loading}>
                        {isArabic ? 'حجز' : 'Book'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid container spacing={4} sx={{ py: 6, px: 1, maxWidth: 'xl' }}>
                <Grid item xs={12} md={8}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {isArabic ? serviceId ? 'حجز موعد للخدمة' : 'اختر الخدمة' : serviceId ? 'Book an appointment for service' : 'Select a service'}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                        {isArabic ? 'اختر الخدمة التي ترغب في حجز موعد لها' : 'Select the service you want to book an appointment for'}
                                    </Typography>

                                    <FormControl fullWidth sx={{ my: 2, px: 8 }}>
                                        {serviceId ? (
                                            <Typography id="service-label" variant="h6" sx={{ fontWeight: 'bold', color: 'primary' }}>
                                                {selectedService.title[isArabic ? 'ar' : 'en']}
                                            </Typography>
                                        ) : (
                                            <Select
                                                id="service"
                                                name="service"
                                                variant='outlined'
                                                value={bookingData.service}
                                                onChange={handleChangeInput}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>
                                                    {isArabic ? 'اختر الخدمة' : 'Select Service'}
                                                </MenuItem>
                                                {services.map((service) => (
                                                    <MenuItem key={service._id} value={service._id}>
                                                        {service.title[isArabic ? 'ar' : 'en']}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </FormControl>
                                </Grid>
                                {/* Date Picker */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {isArabic ? 'تاريخ الحجز' : 'Booking Date'} : {selectedDate ? selectedDate.format('DD/MM/YYYY') : ''}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateCalendar
                                            defaultValue={dayjs()}
                                            value={selectedDate}
                                            onChange={(date) => handleDateSelection(new Date(date))}
                                            views={['year', 'month', 'day']}
                                            minDate={dayjs()}
                                            maxDate={dayjs().add(1, 'week')}

                                        />
                                    </LocalizationProvider>
                                </Grid>
                                {/* Time */}
                                <Grid item xs={12} md={6} sx={{ px: 2 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {isArabic ? 'وقت الحجز :' : 'Bookable Times :'} {selectedTime ? selectedTime : ''}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        {predefinedTimeSlots.map((time, index) => (
                                            <Grid item xs={6} key={index}>
                                                <Button
                                                    variant="contained"
                                                    color={bookingData.time === time ? 'primary' : 'secondary'}
                                                    sx={{ width: '100%' }}
                                                    onClick={() => handleTimeSelection(time)} disabled={usableTime(time)}
                                                >
                                                    {time}
                                                </Button>
                                            </Grid>
                                        ))}
                                        {predefinedTimeSlots.length === 0 && (

                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                                                <Typography variant="h6" color="textSecondary">
                                                    {isArabic ? 'لا توجد أوقات متاحة لهذا اليوم' : 'No available times for this day'}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <InformationSection clinicInfo={clinicInfo} isDark={isDark} isArabic={isArabic} />
                    </motion.div>
                </Grid>
            </Grid>

            {/* success Dialog */}
            <Dialog
                open={success}
                onClose={handleSuccessClose}
                fullWidth
                maxWidth="sm"
                sx={{ textAlign: 'center', p: 2 }}
            >
                <DialogContent
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <SuccessMessage
                        date={bookingData.date}
                        time={bookingData.time}
                        phone={clinicInfo.phone}
                        name={bookingData.name}
                    />
                </DialogContent>
            </Dialog>

            <BeforeAfterGallery />
            <FAQSection />
            <MapLocationSection />
            <Footer />
            <ScrollToTopButton />
        </Box>
    );
};

const InformationSection = ({ clinicInfo, isDark, isArabic }) => {
    const { t } = useTranslation();
    return (
        <Card sx={{ boxShadow: 3, bgcolor: 'background.paper' }}>
            <CardMedia
                component="img"
                image={isDark ? clinicInfo?.logo.dark : clinicInfo?.logo.light}
                caption={isArabic ? 'صورة العيادة' : 'Clinic Image'}
                alt={isArabic ? 'صورة العيادة' : 'Clinic Image'}
                sx={{ height: 250, objectFit: 'cover' }}
            />
            <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {isArabic ? 'معلومات العيادة' : 'Clinic Information'}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    {isArabic ? 'اسم العيادة:' : 'Clinic Name:'} {isArabic ? clinicInfo?.name.ar : clinicInfo?.name.en}
                </Typography>
                <Typography variant="body2">{isArabic ? clinicInfo?.description.ar : clinicInfo?.description.en}</Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {isArabic ? 'العنوان:' : 'Address:'} {isArabic ? clinicInfo?.address.ar : clinicInfo?.address.en}
                </Typography>
                <Typography variant="body1" sx={{ color: 'primary.main', mt: 1 }}>
                    {isArabic ? 'رقم الهاتف:' : 'Phone:'} {clinicInfo?.primaryContact} / {clinicInfo?.secondaryContact}
                </Typography>
                <Typography variant="body1" sx={{ color: 'primary.main', mt: 1 }}>
                    {isArabic ? 'البريد الإلكتروني:' : 'Email:'} {clinicInfo?.email}
                </Typography>
                <Typography variant="body1" sx={{ color: 'primary.main', mt: 1 }}>
                    {isArabic ? 'الموقع الإلكتروني:' : 'Website:'} {clinicInfo?.website}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {isArabic ? 'ساعات العمل' : 'Opening Hours'}
                </Typography>
                {Object.keys(clinicInfo?.openHours || {}).map(day => (
                    <Box key={day} sx={{ display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid', gap: 2 }}>

                        <Typography variant="h6" color="primary.main">
                            {t(`days.${day}`)}:
                        </Typography>
                        {/* <Box sx={{ flexGrow: 1 }} /> */}
                        <Typography align='center' variant="body1" color="text.secondary">
                            {clinicInfo?.openHours[day].isClosed ? t('days.closed') : `${clinicInfo?.openHours[day].from.toLowerCase().replace(/am|pm/g, (m) => t(`days.${m}`))} - ${clinicInfo?.openHours[day].to.toLowerCase().replace(/am|pm/g, (m) => t(`days.${m}`))}`}
                        </Typography>
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
};

const BeforeAfterGallery = () => {

    const transformations = [
        { before: 'path/to/before-image1.jpg', after: 'path/to/after-image1.jpg' },
        { before: 'path/to/before-image2.jpg', after: 'path/to/after-image2.jpg' },
        { before: 'path/to/before-image3.jpg', after: 'path/to/after-image3.jpg' },
        { before: 'path/to/before-image4.jpg', after: 'path/to/after-image4.jpg' },
    ];

    return (
        <Box sx={{ py: 5, textAlign: 'center', mx: 2 }}>
            <Typography variant="h4" gutterBottom>
                Before & After Gallery
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 4 }}>
                See the amazing transformations of our patients and the quality of our work.
            </Typography>
            <Grid container spacing={4}>
                {transformations.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                Before
                            </Typography>
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.before}
                                alt="Before"
                                sx={{ borderBottom: '1px solid #ddd' }}
                            />
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                After
                            </Typography>
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.after}
                                alt="After"
                                sx={{ borderBottom: '1px solid #ddd' }}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default BookingPage;
