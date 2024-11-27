import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Container, Typography, Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Divider, Accordion, AccordionSummary, AccordionDetails, Modal
} from '@mui/material';
import { Close, ExpandMore as ExpandMoreIcon, KeyboardArrowRight } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useAuth } from '../contexts/AuthContext';
import SuccessMessage from "../components/common/SuccessMessage";
import axiosInstance from '../services/axiosInstance';
import notificationService from '../services/notificationService';
import InformationSection from '../components/common/InformationSection';
import BeforeAfterGallery from '../components/common/BeforeAfterGallery';
import bgImage from '../assets/vectors/dental.jpg';
// date picker
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const BookingPage = () => {
    const { clinicInfo } = useClinicContext();
    const { mode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedService, setSelectedService] = useState({ title: { en: '', ar: '' }, description: { en: '', ar: '' }, price: 0, duration: 0, image: '' });
    const [openDialog, setOpenDialog] = useState(false);

    const [currentDateTime, setCurrentDateTime] = useState({
        day: format(new Date(), 'eeee').toLowerCase()
            .replace(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/, (m) => t(`days.${m}`)),
        date: format(new Date(), 'dd/MM/yyyy'),
        time: format(new Date(), 'hh:mm:ss a').toLowerCase().replace(/am|pm/g, (m) => t(`days.${m}`)),
    });

    const [predefinedTimeSlots, setPredefinedTimeSlots] = useState([]);
    const isDark = mode === 'dark';
    const showSnackBar = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [bookings, setBookings] = useState([]);
    const { id } = useParams();
    const [bookingData, setBookingData] = useState({
        name: '', email: '', phone: '', service: id || '',
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
        try {
            const response = await axiosInstance.get(`/services/${id}`);
            setSelectedService(response.data);
        } catch (error) {
            console.error('Failed to fetch service:', error);
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
        if (date < new Date()) {
            setSelectedTime('');
            showSnackBar(isArabic ? 'لا يمكن حجز موعد في هذا التاريخ' : 'Cannot book appointment on this date', 'error');
            return;
        }

        const selectedDay = format(date, 'eeee').toLowerCase();
        showSnackBar(isArabic ? `تم اختيار اليوم : ${t(`days.${selectedDay}`)}` : `Selected Day : ${t(`days.${selectedDay}`)}`, 'info');

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
        setSelectedTime(time);
        setBookingData({ ...bookingData, time });
        showSnackBar(isArabic ? `تم اختيار الوقت : ${time}` : `Selected Time : ${time}`, 'info');
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

    const handleClick = () => {
        if (bookingData.service === '') {
            showSnackBar(isArabic ? 'الرجاء اختيار الخدمة أولاً' : 'Please select a service first', 'error');
            return;
        }
        if (!selectedDate) {
            showSnackBar(isArabic ? 'الرجاء اختيار التاريخ أولاً' : 'Please select a date first', 'error');
            return;
        }
        if (!selectedTime) {
            showSnackBar(isArabic ? 'الرجاء اختيار الوقت أولاً' : 'Please select a time first', 'error');
            return;
        }
        setOpenDialog(true);
    };

    return (
        <Box>
            <HeaderSection />
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                sx={{
                    color: isDark ? 'white' : 'dark.main',
                    minHeight: '400px',
                    py: 4,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `url(${bgImage}) no-repeat top center/cover`,
                        zIndex: -1,
                        opacity: 0.9,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%)',
                        zIndex: 0,
                    }}
                />
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        zIndex: 1,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Typography variant="h3" align="center" sx={{ color: 'white', mb: 2 }}>
                        {isArabic ? 'حجز موعد عبر الانترنت' : 'Online Booking'}
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ color: 'white', mb: 2 }}>
                        {isArabic ? 'احجز موعدك الآن بكل سهولة' : 'Book your appointment now with ease'}
                    </Typography>
                </Container>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '50px',
                        background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%)',
                        zIndex: 0,

                    }}
                >
                    <Typography variant="body1" align="center" sx={{ color: 'white', mt: 2 }}>
                        {isArabic ? 'الوقت الحالي' : 'Current Time'}: {currentDateTime.day} - {currentDateTime.date} - {currentDateTime.time}
                    </Typography>
                </Box>
            </Box>

            <Container
                sx={{
                    my: 6,
                    backdropFilter: 'blur(8px)',
                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                }}>
                {/* back button */}
                <Button
                    variant="text"
                    startIcon={<KeyboardArrowRight sx={{ color: 'primary.main', mx: 1 }} />}
                    onClick={() => navigate(-1)}
                    sx={{ my: 2, color: 'primary.main' }}
                >
                    {isArabic ? 'العودة' : 'Back'}
                </Button>
                <Grid container spacing={4}>
                    {/* Date */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
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
                                sx={{ mt: 2 }}
                                disablePast
                            />
                        </LocalizationProvider>
                    </Grid>
                    {/* Time */}
                    <Grid item xs={12} md={4} sx={{ px: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
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
                    {/* service */}
                    <Grid item xs={12} md={4}>
                        <Accordion
                            expanded={true}
                            elevation={0}
                            square
                            disableGutters
                            sx={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)', color: isDark ? 'white' : 'dark.main' }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-expanded={true}
                                aria-controls="panel1a-content"
                                id="panel1a-header"

                            >
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {isArabic ? 'الخدمة المحددة' : 'Selected Service'}
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {isArabic ? selectedService.title.ar : selectedService.title.en}
                                    </Typography>
                                    <Typography variant="body1">
                                        {isArabic ? selectedService.description.ar : selectedService.description.en}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'primary.main' }}>
                                        {selectedService.price} {t('currency')}
                                    </Typography>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClick}
                            sx={{ mt: 2, width: '100%' }}
                        >
                            {isArabic ? 'احجز الآن' : 'Book Now'}
                        </Button>
                    </Grid>
                </Grid>
            </Container>

            <InformationSection />
            <BeforeAfterGallery />
            <ScrollToTopButton />
            <Footer />

            {/* success Modal */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: success ? 1 : 0 }}
                transition={{ duration: 0.6 }}
            >
                <Modal
                    open={success}
                    onClose={handleSuccessClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <SuccessMessage
                            phone={clinicInfo?.phone}
                            name={bookingData.name}
                            date={bookingData.date}
                            time={bookingData.time}
                        />
                    </Box>
                </Modal>
            </motion.div>


            {/* Booking Dialog */}
            < Dialog open={openDialog} onClose={handleDialogClose} >
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
                    <Divider orientation="vertical" flexItem />
                    <Button variant='contained' onClick={handleSubmission} color="primary" disabled={loading}>
                        {isArabic ? 'حجز' : 'Book'}
                    </Button>
                </DialogActions>
            </Dialog >
        </Box >
    );
};

export default BookingPage;

