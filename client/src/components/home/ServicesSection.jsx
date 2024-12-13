import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemText, ListItemAvatar, Divider, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from '@mui/icons-material';
import { fetchServices } from "../../services/servicesService";
import backgroundImage from '../../assets/images/m_mabrouk.jpg';



const ServicesSection = () => {
    const { mode: themeMode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const isArabic = i18n.language === 'ar';

    useEffect(() => {
        fetchServicesData();
    }, []);

    const fetchServicesData = async () => {
        setLoading(true);
        try {
            fetchServices().then((services) => {
                setServices(services.filter((service) => service.isActive));
            }).catch((error) => {
                console.error('Error fetching services:', error);
            }).finally(() => {
                setLoading(false);
            });
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', py: 10 }}>
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, textAlign: 'center', color: 'primary.main' }}>
                        {t('servicesSection.title')}
                    </Typography>
                    <Typography sx={{ mb: 5, maxWidth: 600, mx: 'auto', color: themeMode === 'dark' ? '#ccc' : '#555', textAlign: 'center' }}>
                        {t('servicesSection.description')}
                    </Typography>
                </motion.div>

                <Grid container spacing={4} justifyContent="center">
                    {services?.slice(0, 8).map((service, index) => (
                        <Grid item xs={12} sm={6} md={3} key={service._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.3 }}
                            >
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        borderRadius: 1,
                                        transition: 'transform 0.3s',
                                        minHeight: 300,
                                        bgcolor: themeMode === 'dark' ? '#2A2A2A' : '#fff',
                                        '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            mx: 'auto',
                                            mb: 2,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #2F8DF7, #2CB9BF, #2CB9BF, #2F8DF7)',
                                        }}
                                    >
                                        <img src={service.icon} alt={service.title.en} style={{ width: '100%', height: '100%' }} />
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="h4" sx={{ fontWeight: 600, fontSize: '1.2rem', mb: 1, fontFamily: 'Poppins' }}>
                                        {isArabic ? service.title.ar : service.title.en}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: themeMode === 'dark' ? '#ccc' : '#555', mt: 1, fontWeight: 400 }}>
                                        {isArabic ? service.description.ar : service.description.en}
                                    </Typography>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* About Section */}
            <Box
                sx={{
                    mt: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(45deg, #3B969F, #2F8DF7, #2CB9BF, #2F8DF7, #3B969F)',
                    overflow: 'hidden',
                }}
            >
                <Grid container >
                    {/* Image Section */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
                        >
                            <img src={backgroundImage} alt="About Us" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </motion.div>
                    </Grid>

                    {/* Text Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 4, }}>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        textAlign: isArabic ? 'right' : 'left',
                                        fontFamily: 'Poppins',
                                        fontSize: { xs: '2rem', sm: '2.5rem' },
                                        color: 'white',
                                        fontShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    {t('servicesSection.featureSection.title')}
                                </Typography>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        my: 3,
                                        color: 'white',
                                        textAlign: isArabic ? 'right' : 'left',
                                    }}
                                >
                                    {t('servicesSection.featureSection.description')}
                                </Typography>
                            </motion.div>

                            <Divider sx={{ width: '70%', my: 3, mx: 0 }} />

                            {/* List Section */}
                            <List>
                                {services.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 * index }}
                                    >

                                        <ListItem disablePadding>
                                            <ListItemAvatar>
                                                <CheckCircle fontSize="large" sx={{ mx: 2, color: '#fff' }} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        variant="h6"
                                                        align={isArabic ? 'right' : 'left'}
                                                        sx={{ fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif' }}>
                                                        {isArabic ? item.title.ar : item.title.en}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography
                                                        variant="body2"
                                                        align={isArabic ? 'right' : 'left'}
                                                        sx={{ color: 'white' }}>
                                                        {(isArabic ? item.description.ar : item.description.en).slice(0, 100)}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    </motion.div>
                                ))}
                            </List>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ServicesSection;
