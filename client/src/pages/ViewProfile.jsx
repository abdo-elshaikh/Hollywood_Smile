import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography,
    Avatar, Grid, Paper, Button, Tab, Tabs, Divider,
    CircularProgress, Rating, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField,
    Checkbox, FormControlLabel, FormGroup,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { arEG, enUS } from '@mui/material/locale';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from '../contexts/ClinicContext';
import { useAuth } from '../contexts/AuthContext';
import doctorService from '../services/doctorService';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import InfoIcon from '@mui/icons-material/Info';
import GradeIcon from '@mui/icons-material/Grade';
import RatingIcon from '@mui/material/Rating';
import BookIcon from '@mui/icons-material/Book';
import { Facebook, LinkedIn, Twitter, Instagram, Person } from '@mui/icons-material';

const ViewProfile = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [doctor, setDoctor] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState([]);
    const [workingHours, setWorkingHours] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newRatings, setNewRatings] = useState([]);
    const navigate = useNavigate();
    const averageRating = rating?.reduce((acc, item) => acc + item.stars, 0) / rating?.length;

    useEffect(() => {
        const fetchDoctor = async () => {
            setLoading(true);
            try {
                const data = await doctorService.getDoctorById(id);
                setDoctor(data);
                setRating(data.rating);
                setWorkingHours(data.workingHours);
            } catch (error) {
                setError(t('error.fetchingDoctor'));
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id, t]);

    const groupedRatings = rating.reduce((acc, item) => {
        if (!acc[item.name]) {
            acc[item.name] = 0;
        }
        acc[item.name] += item.stars;
        return acc;
    }, {});


    const handleAddRating = async (id, ratings) => {
        try {
            const data = await doctorService.addRating(id, ratings);
            console.log('data:', data);
            setRating(data.rating);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTabChange = (event, newValue) => setActiveTab(newValue);
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
                <Typography variant="h4" align="center" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    const ratingNames = {
        'work skills': { ar: 'مهارات العمل', en: 'Work Skills' },
        'communication skills': { ar: 'مهارات الاتصال', en: 'Communication Skills' },
        'punctuality': { ar: 'الانضباط', en: 'Punctuality' },
        'cleanliness': { ar: 'النظافة', en: 'Cleanliness' },
        'professionalism': { ar: 'الاحترافية', en: 'Professionalism' },
        'overall experience': { ar: 'التجربة العامة', en: 'Overall Experience' },
    };

    return (
        <>
            <HeaderSection />
            <Container maxWidth="lg" sx={{ mt: 12, mb: 6, p: 4, borderRadius: 2, boxShadow: 3 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            mb: 4,
                            p: 4,
                            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))',
                        }}
                    >
                        <Avatar
                            src={doctor?.imageUrl}
                            alt={doctor?.name?.en}
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                boxShadow: 3,
                                mb: 2,
                                '&:hover': { transform: 'scale(1.1)', transition: '0.3s' }
                            }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                            {isArabic ? doctor?.name?.ar : doctor?.name?.en}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>
                            {isArabic ? doctor?.position?.ar : doctor?.position?.en}
                        </Typography>
                        <Rating value={averageRating} readOnly size="medium" sx={{ mt: 1 }} />
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        centered
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab icon={<Person />} label={isArabic ? 'حول' : 'About'} />
                        <Tab icon={<InfoIcon />} label={isArabic ? 'معلومات' : 'Information'} />
                        <Tab icon={<GradeIcon />} label={isArabic ? 'تقييم' : 'Rating'} />
                    </Tabs>
                </motion.div>
                <Box sx={{ mt: 4 }}>
                    {activeTab === 0 && <AboutTab isArabic={isArabic} doctor={doctor} workingHours={workingHours} />}
                    {activeTab === 1 && <InfoTab isArabic={isArabic} doctor={doctor} />}
                    {activeTab === 2 && <RatingTab isArabic={isArabic} ratings={groupedRatings} ratingNames={ratingNames} onAddRating={handleOpenDialog} />}
                </Box>
                <Dialog dir={isArabic ? 'rtl' : 'ltr'} open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{isArabic ? 'أضف تقييمك' : 'Add Your Rating'}</DialogTitle>
                    <DialogContent>
                        <RatingDialog isArabic={isArabic} onSubmit={handleAddRating} onClose={handleCloseDialog} id={id} ratingNames={ratingNames} />
                    </DialogContent>
                </Dialog>
            </Container>
            <Footer />
        </>
    );
};

const RatingDialog = ({ isArabic, onSubmit, onClose, id, ratingNames }) => {
    const { user } = useAuth();
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (Object.keys(ratings).length === 0) return;
        if (!user) return;

        setLoading(true);
        try {
            await onSubmit(id, ratings);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const handleRatingChange = (name, value) => {
        if (!name || !value) return;
        const newRating = { name, stars: value };
        setRatings((prevRatings) => {
            if (!prevRatings) return [newRating];
            return [...prevRatings, newRating];
        });
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography
                align="center"
                variant="body2"
                sx={{ color: 'text.secondary', mb: 2 }}
            >
                {isArabic ? 'قم بتقييم الطبيب' : 'Rate the doctor'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.keys(ratingNames).map((name, index) => (
                    <Box
                        key={index}
                        direction={isArabic ? 'rtl' : 'ltr'}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2,
                            justifyContent: 'space-between',
                            borderBottom: 1,
                            borderColor: 'divider',
                            pb: 1
                        }}
                    >
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {isArabic ? ratingNames[name].ar : ratingNames[name].en} :
                        </Typography>
                        <Rating
                            name={name}
                            value={ratings[name]}
                            onChange={(event, value) => handleRatingChange(name, value)}
                            size="large"
                            sx={{ color: 'secondary.main' }}
                        />

                    </Box>
                ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                <Button
                    onClick={onClose}
                    color="secondary"
                    variant="outlined"
                    fullWidth
                >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} /> : isArabic ? 'إرسال' : 'Submit'}
                </Button>
            </Box>
        </Box>
    );
};

const AboutTab = ({ isArabic, doctor, workingHours }) => (
    <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
                    {isArabic ? 'ساعات العمل' : 'Working Hours'}
                </Typography>
                {workingHours?.map((item, index) => (
                    <Typography key={index} variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.day}: {item.startTime} - {item.endTime}
                    </Typography>
                ))}
                {!workingHours.length && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {isArabic ? 'لا يوجد ساعات عمل حتى الان' : 'No working hours yet'}
                    </Typography>
                )}
            </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
                    {isArabic ? 'معلومات الاتصال' : 'Contact Information'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>{isArabic ? 'البريد الإلكتروني' : 'Email'}:</strong> {doctor.email}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>{isArabic ? 'الهاتف' : 'Phone'}:</strong> {doctor.phone}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>{isArabic ? 'العنوان' : 'Address'}:</strong> {doctor.address}
                </Typography>
            </Paper>
        </Grid>
    </Grid>
);

const InfoTab = ({ isArabic, doctor }) => (
    <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
                    {isArabic ? 'وصف' : 'Description'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {isArabic ? doctor.description.ar : doctor.description.en}
                </Typography>
            </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
                    {isArabic ? 'روابط التواصل الاجتماعي' : 'Social Links'}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <Facebook />
                    </Grid>
                    <Grid item>
                        <Twitter />
                    </Grid>
                    <Grid item>
                        <Instagram />
                    </Grid>
                    <Grid item>
                        <LinkedIn />
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    </Grid>
);

const RatingTab = ({ isArabic, ratings, onAddRating, ratingNames }) => {
    const { user } = useAuth();

    // Check if there are no ratings at all
    const hasRatings = ratings?.length > 0;


    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, boxShadow: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
                        {isArabic ? 'التقييم' : 'Rating'}
                    </Typography>
                    {/* Iterate through grouped ratings */}
                    {Object.keys(ratingNames).map((name, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {isArabic ? ratingNames[name].ar : ratingNames[name].en}
                            </Typography>
                            <RatingIcon value={ratings[name]} readOnly />
                        </Box>
                    ))}
                    {!hasRatings && (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {isArabic ? 'لا يوجد تقييمات حتى الان' : 'No ratings yet'}
                        </Typography>
                    )}
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
                        {isArabic ? 'أضف تقييمك' : 'Add Your Rating'}
                    </Typography>
                    <Button disabled={!user} onClick={onAddRating} variant="contained" color="primary" startIcon={<GradeIcon sx={{ mx: 2, color: 'white' }} />}>
                        {isArabic ? 'أضف تقييم' : 'Add Rating'}
                    </Button>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                        {isArabic ? 'يمكنك اضافة تقييمك للطبيب' : 'You can add a rating for the doctor.'}
                    </Typography>
                    {/* you must be logged in */}
                    {!user && (
                        <Typography variant="body2" sx={{ color: 'primary.dark', mt: 2 }}>
                            {isArabic ? 'يجب تسجيل الدخول لإضافة تقييم' : 'You must be logged in to add a rating'}
                        </Typography>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ViewProfile;
