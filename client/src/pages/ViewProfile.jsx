import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography,
    Avatar, Grid, Paper, Button, Tab, Tabs, Divider,
    CircularProgress, Rating, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField,
    Checkbox, FormControlLabel, FormGroup
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from '../contexts/ClinicContext';
import { useAuth } from '../contexts/AuthContext';
import doctorService from '../services/doctorService';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import InfoIcon from '@mui/icons-material/Info';
import BookIcon from '@mui/icons-material/Book';
import GradeIcon from '@mui/icons-material/Grade';
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
    const { clinicInfo } = useClinicContext();
    const { user } = useAuth();
    const [newRate, setNewRate] = useState({ name: '', stars: 0, comment: '', user: '' });
    const [newRatings, setNewRatings] = useState([]);
    const navigate = useNavigate();
    const averageRating = rating.reduce((acc, item) => acc + item.stars, 0) / rating.length;

    // category of ratings with names and average rating
    // const averageRatings = rating.reduce((acc, item) => {
    //     if (!acc[item.name]) {
    //         acc[item.name] = { total: 0, count: 0 };
    //     }
    //     acc[item.name].total += item.stars;
    //     acc[item.name].count++;
    //     return acc;
    // }, {});


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

    const ratings = {
        "work skills": { en: 'work skills', ar: 'مهارات العمل' },
        "communication skills": { en: 'communication skills', ar: 'مهارات الاتصال' },
        "punctuality": { en: 'punctuality', ar: 'الانضباط' },
        "cleanliness": { en: 'cleanliness', ar: 'النظافة' },
        "professionalism": { en: 'professionalism', ar: 'الاحترافية' },
        "overall experience": { en: 'overall experience', ar: 'التجربة العامة' }
    };

    const handleAddRating = async () => {
        if (!user) return navigate('/auth/login');
        newRate.user = user._id;
        try {
            const response = await doctorService.addRating(id, newRate);
            setRating(response.rating);
            setNewRate({ name: '', stars: 0, comment: '', user: '' });
            setOpenDialog(false);
        } catch (error) {
            console.error('Error adding rating:', error);
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

    const handleRatingChange = (value) => {
        setNewRatings([...newRatings, { ...newRate, stars: value }]);
    };

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
                <Typography variant="h4" align="center" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

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
                    
                    {activeTab === 0 && (
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={8}>
                                <Paper elevation={3} sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                                        {isArabic ? 'الوصف الوظيفي' : 'Job Description'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {isArabic ? doctor?.description?.ar : doctor?.description?.en}
                                    </Typography>
                                </Paper>
                                <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                                        {isArabic ? 'ساعات العمل' : 'Working Hours'}
                                    </Typography>
                                    {workingHours?.map((day, index) => (
                                        <Typography key={index} variant="body2" color="text.secondary">
                                            <strong>{day.day}:</strong> {day.startTime} - {day.endTime}
                                        </Typography>
                                    ))}
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                                        {isArabic ? 'موقع العيادة' : 'Clinic Location'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {isArabic ? clinicInfo.address.ar : clinicInfo.address.en}<br /> {clinicInfo.phone}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Button onClick={() => navigate('/booking')} variant="contained" color="primary" fullWidth>
                                        {isArabic ? 'حجز موعد' : 'Book Appointment'}
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}

                    {activeTab === 1 && (
                        <>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                                    {isArabic ? 'معلومات الطبيب' : 'Doctor Information'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>{isArabic ? 'البريد الالكتروني' : 'Email'}:</strong> {doctor?.email || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>{isArabic ? 'رقم الهاتف' : 'Phone'}:</strong> {doctor?.phone || 'N/A'}
                                </Typography>
                            </Paper>
                            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                                    {isArabic ? 'روابط التواصل الاجتماعي' : 'Social Links'}
                                </Typography>
                                <Grid container spacing={2}>
                                    {doctor?.socialLinks && Object.entries(doctor.socialLinks).map(([key, value]) => (
                                        value && (
                                            <Grid item key={key}>
                                                <Button
                                                    href={value}
                                                    target="_blank"
                                                    color="primary"
                                                    startIcon={{
                                                        facebook: <Facebook />,
                                                        twitter: <Twitter />,
                                                        instagram: <Instagram />,
                                                        linkedin: <LinkedIn />
                                                    }[key.toLowerCase()]}
                                                >
                                                    {key}
                                                </Button>
                                            </Grid>
                                        )
                                    ))}
                                </Grid>
                            </Paper>
                        </>
                    )}

                    {activeTab === 2 && (
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {isArabic ? 'التقييمات' : 'Ratings'}
                                </Typography>
                                <Button variant="outlined" color="primary" onClick={handleOpenDialog}>
                                    {isArabic ? 'أضف تقييمك' : 'Add Your Rating'}
                                </Button>
                            </Box>
                            {rating.length > 0 ? (
                                rating.map((rate, index) => (
                                    <Box key={index} sx={{ mt: 2, p: 2, border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
                                        <Typography variant="body2" color="text.primary">
                                            <strong>
                                                {isArabic ? ratings[rate?.name].ar : ratings[rate?.name].en}
                                            </strong>
                                        </Typography>
                                        <Rating value={rate.stars} readOnly size="small" />
                                        <Typography variant="body2" color="text.secondary">{rate.comment}</Typography>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {isArabic ? 'بواسطة' : 'By'}: {rate.user?.name} 
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">{isArabic ? 'لا توجد تقييمات' : 'No ratings yet'}</Typography>
                            )}
                        </Paper>
                    )}
                </Box>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{isArabic ? 'أضف تقييمك' : 'Add Your Rating'}</DialogTitle>
                    <DialogContent>
                        {Object.keys(ratings).map((key, index) => (
                            <FormGroup
                                key={index}
                                sx={{ mb: 2 }}

                            >
                                <FormControlLabel
                                    key={index}
                                    control={<Checkbox
                                        checked={newRate.name === key}
                                        disabled={newRatings.some(rate => rate.name === key)}
                                        onChange={(e) => setNewRate({ ...newRate, name: e.target.checked ? key : '' })}
                                    />}
                                    label={isArabic ? ratings[key].ar : ratings[key].en}
                                />
                                <Rating
                                    value={newRate.stars}
                                    disabled={newRate.name !== key}
                                    onChange={(e, value) => handleRatingChange(value)}
                                    sx={{ mb: 2 }}
                                />
                            </FormGroup>
                        ))}

                        <TextField
                            fullWidth
                            label={isArabic ? 'التعليق' : 'Comment'}
                            multiline
                            rows={3}
                            value={newRate.comment}
                            onChange={(e) => setNewRate({ ...newRate, comment: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        {newRatings.map((rate, index) => (
                            <Box key={index} sx={{ mt: 2, p: 2, border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.primary"><strong>{rate.name}</strong></Typography>
                                <Rating value={rate.stars} size='small' readOnly />
                                <Typography variant="body2" color="text.secondary">{rate.comment}</Typography>
                            </Box>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">{isArabic ? 'إلغاء' : 'Cancel'}</Button>
                        <Button onClick={handleAddRating} color="primary">{isArabic ? 'إرسال' : 'Submit'}</Button>
                    </DialogActions>
                </Dialog>
            </Container>
            <Footer />
        </>
    );
};

export default ViewProfile;
