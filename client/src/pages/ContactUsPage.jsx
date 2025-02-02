import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, TextField, Button, Paper, Divider, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Email, Phone, LocationOn, Star } from '@mui/icons-material';
import { useClinicContext } from '../contexts/ClinicContext';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import MainHeaderPages from '../components/common/MainHeaderPages';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import OffersSection from '../components/home/OffersSection';
import axiosInstance from '../services/axiosInstance';

const ContactUsPage = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const { clinicInfo } = useClinicContext();
    const [testimonials, setTestimonials] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.message) {
            alert(t('contactUs.requiredFields'));
            return;
        }

        try {
            await axiosInstance.post('/contact', formData);
            alert(t('contactUs.successMessage'));
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
            });
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert(t('contactUs.errorMessage'));
        }
    };

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await axiosInstance.get('/testimonials');
                const testimonials = response.data.filter((testimonial) => testimonial.show);
                const shuffledTestimonials = testimonials.sort(() => 0.5 - Math.random());
                setTestimonials(shuffledTestimonials);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            }
        };

        fetchTestimonials();
    }, []);
    return (
        <>
            <HeaderSection />
            <MainHeaderPages title={t('contactUs.title')} page={t('contactUs.title')} />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h4" align="center" sx={{ mt: 4, mb: 2 }}>
                    {t('contactUs.formTitle')}
                </Typography>
                <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mb: 2, p: 2, fontSize: 32, boxShadow: 4 }}>
                                    <LocationOn />
                                </Avatar>
                                <Typography variant="h6">{t('contactUs.addressTitle')}</Typography>
                                <Typography variant="body1" align="center">
                                    {isArabic ? clinicInfo.address.ar : clinicInfo.address.en},
                                </Typography>
                                <Divider sx={{ my: 2, width: '100%' }} />
                                <Typography variant="h6">{t('contactUs.phoneTitle')}</Typography>
                                <Typography variant="body1" align="center">
                                    {clinicInfo.phone}
                                </Typography>
                                <Divider sx={{ my: 2, width: '100%' }} />
                                <Typography variant="h6">{t('contactUs.emailTitle')}</Typography>
                                <Typography variant="body1" align="center">
                                    {clinicInfo.email}
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Contact Form */}
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3 }}>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label={t('contactUs.nameLabel')}
                                                variant="outlined"
                                                fullWidth
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label={t('contactUs.phoneLabel')}
                                                variant="outlined"
                                                fullWidth
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <TextField
                                                label={t('contactUs.emailLabel') + ' *'}
                                                variant="outlined"
                                                fullWidth
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label={t('contactUs.messageLabel')}
                                                variant="outlined"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                                {t('contactUs.submitButton')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 6 }} />
                    <OffersSection />

                    <Divider sx={{ my: 6 }} />

                    {/* Testimonial Section */}
                    <Box sx={{ mt: 8 }}>
                        <Typography variant="h3" align="center" mb={2} gutterBottom>{t('contactUs.testimonialsTitle')}</Typography>
                        <Typography variant="body1" align="center" mb={4} color="textSecondary">
                            {isArabic ? 'قراءة ماذا يقول عملاؤنا عنا' : 'Read what our patients have to say about us.'}
                        </Typography>

                        <Grid container spacing={3}>
                            {testimonials.slice(0, 6).map((testimonial, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                                        <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56, mb: 2 }}>
                                            <Star />
                                        </Avatar>
                                        <Typography variant="h6" align="center">{testimonial.name}</Typography>
                                        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                                            "{testimonial.quote}"
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" align="center">
                                            {Array.from({ length: testimonial.rating }).map((_, index) => (
                                                <Star key={index} sx={{ color: 'warning.main' }} />
                                            ))}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 6 }} />

                    {/* Google Map Section (Optional) */}
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h5" align="center" sx={{ mb: 2 }} gutterBottom>{t('contactUs.mapTitle')}</Typography>
                        <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 4 }}>
                            {isArabic ? 'العثور على العيادة على الخريطة' : 'Find the clinic on the map'}
                        </Typography>
                        <Box sx={{ position: 'relative', height: 400 }}>
                            <iframe
                                title="Google Map"
                                src={clinicInfo.mapLink || 'https://maps.google.com/maps?q=clinic&z=15&output=embed'}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                            // loading="lazy"
                            ></iframe>
                        </Box>
                    </Box>


                </Container>
            </motion.div>
            <Footer />
            <ScrollToTopButton />
        </>
    );
};

export default ContactUsPage;
