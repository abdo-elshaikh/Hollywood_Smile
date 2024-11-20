import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
    IconButton,
    Card,
    CardContent,
    CardMedia,
    Badge,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { ThumbUp, ThumbDown, Close } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
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
import GallerySection from '../components/home/GallerySection';

const BookingPage = () => {
    const { clinicInfo } = useClinicContext();
    const { mode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState({
        day: format(new Date(), 'eeee').toLowerCase().replace(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/, (m) => t(`days.${m}`)),
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
        name: '',
        email: '',
        phone: '',
        service: serviceId || '',
        date: '',
        time: '',
        message: '',
        user: user?._id || null,
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
            const { data } = await axiosInstance.get('/services');
            setServices(data);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        }
    };

    useEffect(() => {
        fetchBookings();
        if (bookingData.service === '') {
            fetchServices();
        }
    }, []);

    const usableTime = (time) => {
        if (!selectedDate) return false;
        const times = bookings.filter((booking) => new Date(booking.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString())
            .map((booking) => booking.time);
        return times.includes(time);
    };

    const handleDateSelection = (info) => {
        const date = info.startStr;

        if (!info || !date || new Date(date) < new Date()) {
            showSnackBar(isArabic ? 'يرجى تحديد موعد مستقبلي.' : 'Please select a future date.', 'warning');
            return;
        }

        setSelectedDate(new Date(date));
        setBookingData({ ...bookingData, date: format(date, 'yyyy-MM-dd') });
        showSnackBar(`Date selected: ${t(`days.${format(date, 'eeee').toLowerCase()}`)}`, 'info');
        const times = clinicInfo?.onlineTimes.find((time) => time.day.toLowerCase() === format(date, 'eeee').toLowerCase());
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
        setOpenDialog(true);
        showSnackBar(`Time selected: ${time}`, 'info');
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const servicesList = useMemo(() => services.map((service) => ({
        _id: service._id || serviceId,
        title: {
            en: service.title.en,
            ar: service.title.ar,
        },
    })), [services, isArabic]);

    const bookingList = useMemo(() => bookings.map((booking) => ({
        _id: booking._id,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        message: booking.message,
        user: booking.user,
    })), [bookings]);

    const onlineTimesList = useMemo(() => clinicInfo?.onlineTimes.map((time) => ({
        day: time.day,
        from: time.from,
        to: time.to,
    })), [clinicInfo?.onlineTimes]);

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

            <AppointmentPage
                t={t}
                isArabic={isArabic}
                selectedDate={selectedDate}
                handleDateSelection={handleDateSelection}
                predefinedTimeSlots={predefinedTimeSlots}
                usableTime={usableTime}
                handleTimeSelection={handleTimeSelection}
                bookings={bookingList}
                clinicInfo={clinicInfo}
                isDark={isDark}
            />
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
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>{isArabic ? 'الخدمة' : 'Service'}</InputLabel>
                        <Select
                            name="service"
                            value={serviceId || bookingData.service}
                            onChange={handleChangeInput}
                            fullWidth
                            required
                            displayEmpty
                            disabled={serviceId}
                        >
                            <MenuItem value="" disabled>{isArabic ? 'اختر الخدمة' : 'Select Service'}</MenuItem>
                            {services.map((service) => (
                                <MenuItem key={service._id} value={service._id}>{isArabic ? service.title.ar : service.title.en}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                    <Button onClick={handleDialogClose} color="secondary">
                        {isArabic ? 'إلغاء' : 'Cancel'}
                    </Button>
                    <Button onClick={handleSubmission} color="primary" disabled={loading}>
                        {isArabic ? 'حجز' : 'Book'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={showSnackBar.open}
                autoHideDuration={3000}
                onClose={() => showSnackBar.close()}
                message={showSnackBar.message}
                action={
                    <IconButton size="small" color="inherit" onClick={() => showSnackBar.close()}>
                        <Close fontSize="small" />
                    </IconButton>
                }
            />

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
                        flexDirection: 'column',
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
            {/* <GallerySection /> */}
            <FAQSection />
            <MapLocationSection />
            <Footer />
            <ScrollToTopButton />
        </Box>
    );
};

const AppointmentPage = ({
    isArabic,
    t,
    selectedDate,
    handleDateSelection,
    predefinedTimeSlots,
    usableTime,
    handleTimeSelection,
    bookings,
    clinicInfo,
    isDark
}) => (
    <Container maxWidth="xl" sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 4 }}>
        <Grid container spacing={4}>
            {/* Available Slots and Calendar Section */}
            <Grid item xs={12} md={8}>
                <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, height: '100%' }}>
                    {/* Available Time Slots */}
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
                        {isArabic ? 'الوقت المتاح' : 'Available Time Slots'}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        {selectedDate ? (
                            <Box id="available-time-slots" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                                {predefinedTimeSlots.map((time, index) => (
                                    <Badge
                                        key={index}
                                        badgeContent={usableTime(time) ? <ThumbDown color="error" /> : <ThumbUp color="success" />}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            disabled={usableTime(time)}
                                            onClick={() => handleTimeSelection(time)}
                                            sx={{
                                                minWidth: '100px',
                                                height: '50px',
                                                fontWeight: 'bold',
                                                borderRadius: 2,
                                                '&:hover': {
                                                    borderColor: usableTime(time) ? 'error.main' : 'success.main',
                                                    color: usableTime(time) ? 'error.main' : 'success.main',
                                                },
                                            }}
                                        >
                                            {time}
                                        </Button>
                                    </Badge>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                                {isArabic ? 'يرجى تحديد تاريخ لعرض الأوقات المتاحة' : 'Please select a date to view available times.'}
                            </Typography>
                        )}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Calendar Section */}
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                        {isArabic ? 'اختر التاريخ' : 'Select Date'}
                    </Typography>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        selectable
                        select={handleDateSelection}
                        events={bookings.map((booking) => ({
                            title: isArabic ? 'محجوز' : 'Booked',
                            start: booking.date,
                        }))}
                        eventColor="#f50057"
                        eventTextColor="#fff"
                        height="auto"
                        locale={isArabic ? 'ar' : 'en'}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        buttonText={{
                            today: isArabic ? 'اليوم' : 'Today',
                            month: isArabic ? 'شهر' : 'Month',
                            week: isArabic ? 'أسبوع' : 'Week',
                            day: isArabic ? 'يوم' : 'Day',
                        }}
                        eventContent={(arg) => (
                            <Box
                                sx={{
                                    backgroundColor: isDark ? '#333' : '#f50057',
                                    color: 'white',
                                    p: 1,
                                    borderRadius: 1,
                                    width: '100%'
                                }}
                            >
                                <Typography align={isArabic ? 'right' : 'left'} variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {arg.start} - {arg.event.title}
                                </Typography>
                            </Box>
                        )}
                    />
                </Box>
            </Grid>

            {/* Clinic Information Sidebar */}
            <Grid item xs={12} md={4}>
                <Card sx={{ boxShadow: 3, bgcolor: 'background.paper' }}>
                    <CardMedia
                        component="img"
                        image={isDark ? clinicInfo?.logo.dark : clinicInfo?.logo.light}
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
                            <Box key={day} sx={{ display: 'flex', alignItems: 'center',  mb: 1, borderBottom: '1px solid', gap: 2 }}>

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
            </Grid>
        </Grid>
    </Container>
);




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
