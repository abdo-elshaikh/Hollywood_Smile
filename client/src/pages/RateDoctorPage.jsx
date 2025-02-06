import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Rating,
    Button,
    Paper,
    Box,
    CircularProgress,
    Divider,
    Alert,
    Fade,
    Stack,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../contexts/SnackbarProvider';
import doctorService from '../services/doctorService';
import Footer from '../components/home/Footer';
import HeaderSection from '../components/home/HeaderSection';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import TestimonialForm from '../components/common/TestimonialForm';
import { useAuth } from '../contexts/AuthContext';
const RateDoctorPage = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const { user } = useAuth();
    const isArabic = i18n.language === 'ar';
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [rating, setRating] = useState([]);
    const [newRatings, setNewRatings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const averageRating = rating?.length > 0 ? rating.reduce((acc, curr) => acc + curr.stars, 0) / rating.length : 0;

    const ratingCriteria = {
        'work skills': { ar: 'مهارات العمل', en: 'Work Skills' },
        'communication skills': { ar: 'مهارات الاتصال', en: 'Communication Skills' },
        punctuality: { ar: 'الانضباط', en: 'Punctuality' },
        cleanliness: { ar: 'النظافة', en: 'Cleanliness' },
        professionalism: { ar: 'الاحترافية', en: 'Professionalism' },
        'overall experience': { ar: 'التجربة العامة', en: 'Overall Experience' },
    };

    useEffect(() => {
        const fetchDoctor = async () => {
            setLoading(true);
            try {
                const data = await doctorService.getDoctorById(id);
                setDoctor(data);
                setRating(data.rating || []);
            } catch {
                setError(t('error.fetchingDoctor'));
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id, t]);

    const handleRatingChange = (name, value) => {
        const updatedRatings = newRatings.filter((r) => r.name !== name);
        setNewRatings([...updatedRatings, { name, stars: value }]);
    };

    const handleSubmit = async () => {
        if (newRatings.length === 0) {
            showSnackbar(isArabic ? 'يرجى تقييم الطبيب' : 'Please rate the doctor', 'error');
            return;
        }
        setLoading(true);
        try {
            const data = await doctorService.addRating(id, newRatings);
            setRating(data.rating);
            showSnackbar(isArabic ? 'تم حفظ التقييم بنجاح' : 'Ratings saved successfully', 'success');
            setNewRatings([]);
            if (!user) navigate('/');
            else setOpenDialog(true);
        } catch {
            showSnackbar(isArabic ? 'حدث خطأ' : 'An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HeaderSection />
            <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
                {loading && (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <CircularProgress size={60} thickness={4} />
                    </Box>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
                {!loading && doctor && (
                    <Grid container spacing={4}>
                        {/* Doctor Info Section */}
                        <Grid item xs={12} md={4}>
                            <Fade in timeout={1000}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    position="relative"
                                    sx={{
                                        '&:hover img': { transform: 'scale(1.05)' },
                                        '&:hover': { boxShadow: 4 },
                                        height: '100%',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={doctor.imageUrl}
                                        alt={doctor.name.en}
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            transition: 'transform 0.3s ease',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <Box
                                        position="absolute"
                                        bottom={0}
                                        width="100%"
                                        sx={{
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            color: 'black',
                                            p: 2,
                                            borderRadius: '8px',
                                        }}
                                    >
                                        <Typography variant="h5" align="center">
                                            {doctor.name[isArabic ? 'ar' : 'en']}
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            {doctor.position[isArabic ? 'ar' : 'en']}
                                        </Typography>
                                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={1}>
                                            <Rating
                                                name="average-rating"
                                                value={averageRating}
                                                precision={0.1}
                                                readOnly
                                            />
                                            <Typography variant="body2" sx={{ ml: 1 }}>
                                                ({averageRating.toFixed(1)})
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Fade>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Fade in timeout={1250}>
                                <Paper elevation={3} sx={{ p: 4, boxShadow: 4 }}>
                                    <Typography variant="h4" align="center" gutterBottom>
                                        {isArabic ? "معلومات الطبيب" : "Doctor's Info"}
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    <Stack spacing={2}>
                                        <Typography variant="body1">
                                            {isArabic ? 'العنوان' : 'Address'}: {doctor.address[isArabic ? 'ar' : 'en']}
                                        </Typography>
                                        <Typography variant="body1">
                                            {isArabic ? 'البريد الإلكتروني' : 'Email'}: {doctor.email}
                                        </Typography>
                                        <Typography variant="body1">
                                            {isArabic ? 'رقم الهاتف' : 'Phone Number'}: {doctor.phone}
                                        </Typography>
                                        <Typography variant="body1">
                                            {isArabic ? 'الموقع الإلكتروني' : 'Website'}: {doctor.website}
                                        </Typography>
                                    </Stack>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ mt: 3, py: 1.5, boxShadow: 2, '&:hover': { boxShadow: 4 } }}
                                        onClick={() => navigate(`/doctors/${id}`)}
                                    >
                                        {isArabic ? 'عرض الملف الشخصي' : 'View Profile'}
                                    </Button>
                                </Paper>
                            </Fade>
                        </Grid>
                        {/* Rating Form Section */}
                        <Grid item xs={12} md={4}>
                            <Fade in timeout={1500}>
                                <Paper elevation={3} sx={{ p: 4, boxShadow: 4, height: '100%' }}>
                                    <Typography variant="h4" align="center" gutterBottom>
                                        {isArabic ? 'قيم الطبيب' : 'Rate the Doctor'}
                                    </Typography>
                                    <Typography variant="body1" align="center" gutterBottom>
                                        {isArabic ? 'قيم الطبيب بناءً على الخبرة الشخصية' : 'Rate the doctor based on personal experience'}
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    {Object.keys(ratingCriteria).map((criteria) => (
                                        <Box
                                            key={criteria}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            sx={{ mb: 2 }}
                                        >
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {ratingCriteria[criteria][isArabic ? 'ar' : 'en']}
                                            </Typography>
                                            <Rating
                                                name={criteria}
                                                value={
                                                    newRatings.find((r) => r.name === criteria)?.stars || 0
                                                }
                                                onChange={(e, value) =>
                                                    handleRatingChange(criteria, value)
                                                }
                                                size="large"
                                            />
                                        </Box>
                                    ))}
                                    <Divider sx={{ my: 3 }} />
                                    <Button
                                        onClick={handleSubmit}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        disabled={loading}
                                        sx={{
                                            py: 1.5,
                                            boxShadow: 2,
                                            '&:hover': { boxShadow: 4 },
                                        }}
                                    >
                                        {isArabic ? 'أرسل' : 'Submit'}
                                    </Button>
                                </Paper>
                            </Fade>
                        </Grid>

                    </Grid>
                )}
            </Container>
            {/* testonal dialog */}
            <TestimonialForm open={openDialog} setOpen={setOpenDialog} />
            <ScrollToTopButton />
            <Footer />
        </Box>
    );
};

export default RateDoctorPage;
