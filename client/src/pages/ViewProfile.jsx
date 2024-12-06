import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography,
    Avatar, Grid, Paper, Button, Tab, Tabs, Divider,
    CircularProgress, Rating, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField,
    Checkbox, FormControlLabel, FormGroup,
    FormControl, InputLabel, Select, MenuItem
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


    const handleAddRating = (response) => {
        setDoctor(response.doctor);
        setOpenDialog(false);
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
                    {activeTab === 2 && <RatingTab isArabic={isArabic} ratings={rating} onAddRating={handleOpenDialog} />}
                </Box>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{isArabic ? 'أضف تقييمك' : 'Add Your Rating'}</DialogTitle>
                    <DialogContent>
                        <RatingDialog isArabic={isArabic} onSubmit={handleAddRating} onClose={handleCloseDialog} id={id} />
                    </DialogContent>
                </Dialog>

            </Container>
            <Footer />
        </>
    );
};

const RatingDialog = ({ isArabic, onSubmit, onClose, id }) => {
    const { user } = useAuth();
    const [newRate, setNewRate] = useState({
        name: '',
        stars: 0,
        comment: '',
        user: user?._id,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewRate((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRatingChange = (event, newValue) => {
        setNewRate((prevState) => ({
            ...prevState,
            stars: newValue,
        }));
    };

    const handleSubmit = async () => {
        if (!user) return;
        try {
            const data = await doctorService.addRating(id, newRate);
            setNewRate({ name: '', stars: 0, comment: '', user: '' });
            onSubmit(data);
        } catch (error) {
            console.error('Error adding rating:', error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="rating-name-label">{isArabic ? 'اسم التقييم' : 'Rating Name'}</InputLabel>
                <Select
                    labelId="rating-name-label"
                    id="rating-name"
                    name="name"
                    value={newRate.name}
                    onChange={handleChange}
                    label={isArabic ? 'اسم التقييم' : 'Rating Name'}
                >
                    <MenuItem value="work skills">{isArabic ? 'مهارات العمل' : 'Work Skills'}</MenuItem>
                    <MenuItem value="communication skills">{isArabic ? 'مهارات الاتصال' : 'Communication Skills'}</MenuItem>
                    <MenuItem value="punctuality">{isArabic ? 'الانضباط' : 'Punctuality'}</MenuItem>
                    <MenuItem value="cleanliness">{isArabic ? 'النظافة' : 'Cleanliness'}</MenuItem>
                    <MenuItem value="professionalism">{isArabic ? 'الاحترافية' : 'Professionalism'}</MenuItem>
                    <MenuItem value="overall experience">{isArabic ? 'التجربة العامة' : 'Overall Experience'}</MenuItem>
                </Select>
            </FormControl>

            <Box sx={{ mb: 2 }}>
                <Rating
                    name="stars"
                    value={newRate.stars}
                    onChange={handleRatingChange}
                    precision={0.5}
                    size="large"
                />
            </Box>

            <TextField
                label={isArabic ? 'التعليق' : 'Comment'}
                name="comment"
                value={newRate.comment}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    {isArabic ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    {isArabic ? 'إرسال' : 'Submit'}
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
                {workingHours.map((item, index) => (
                    <Typography key={index} variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.day}: {item.startTime} - {item.endTime}
                    </Typography>
                ))}
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

const RatingTab = ({ isArabic, ratings, onAddRating }) => {
    const { user } = useAuth();
    // Group ratings by name
    const groupedRatings = ratings?.reduce((acc, rating) => {
        if (!acc[rating.name]) {
            acc[rating.name] = [];
        }
        acc[rating.name].push(rating);
        return acc;
    }, {});

    // Calculate the average rating for each group
    const calculateAverageRating = (ratings) => {
        const totalStars = ratings?.reduce((acc, rating) => acc + rating.stars, 0);
        return ratings?.length > 0 ? totalStars / ratings?.length : 0;
    };

    // Check if there are no ratings at all
    const hasRatings = ratings?.length > 0;

    console.log('groupedRatings:', groupedRatings);
    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, boxShadow: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
                        {isArabic ? 'التقييم' : 'Rating'}
                    </Typography>
                    {/* Iterate through grouped ratings */}
                    {hasRatings ? (
                        Object.keys(groupedRatings).map((group, index) => {
                            const groupRatings = groupedRatings[group];
                            const averageRating = calculateAverageRating(groupRatings);
                            return (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                                        {group}
                                    </Typography>
                                    <Rating value={averageRating} readOnly size="medium" />
                                    {groupRatings?.map((rating, index) => (
                                        <Box key={index} sx={{ mt: 1 }}>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {rating.comment || '-'} - {rating.stars} stars
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            );
                        })
                    ) : (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {isArabic ? 'لا توجد تقييمات' : 'No Ratings Yet'}
                        </Typography>
                    )}
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, boxShadow: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
                        {isArabic ? 'أضف تقييمك' : 'Add Your Rating'}
                    </Typography>
                    <Button disabled={!user} onClick={onAddRating} variant="contained" color="primary" startIcon={<GradeIcon />}>
                        {isArabic ? 'أضف تقييم' : 'Add Rating'}
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ViewProfile;
