import React from 'react';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from '../../contexts/ClinicContext';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Divider,
    CardMedia,
    IconButton,
    Link,
    Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import mapHeader from '../../assets/videos/map-header.mp4';

const MapLocationSection = () => {
    const { clinicInfo } = useClinicContext();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    return (
        <Box
            component="section"
            sx={{ my: 4 }}
        >
            {/* Header Section with Video Background */}
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 400,
                    color: 'white',
                    backgroundAttachment: 'fixed',
                    mb: 4,
                }}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={mapHeader}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        zIndex: 1,
                    }}
                />

                <Box
                    sx={{
                        textAlign: 'center',
                        zIndex: 2,
                    }}
                >
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                            color: 'inherit',
                        }}
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {t('mapLocationSection.title')}
                    </Typography>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                            color: 'inherit',
                        }}
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {t('mapLocationSection.description')}
                    </Typography>
                </Box>
            </Box>

            {/* Location Details Section */}

            <Container
                maxWidth="xl"
            >
                <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                    alignItems="center"
                >

                    {/* Clinic Info */}
                    <Grid item xs={12} textAlign="center">
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            gutterBottom
                            sx={{
                                color: 'primary.main',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                            }}
                            component={motion.div}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            {isArabic ? clinicInfo.name.ar : clinicInfo.name.en} - {isArabic ? "\u0627\u0644\u0641\u0631\u0639 \u0627\u0644\u0631\u0626\u064a\u0633\u064a" : "Main Branch"}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            {isArabic ? clinicInfo.description.ar : clinicInfo.description.en}
                        </Typography>
                        <Divider sx={{ my: 2, bgcolor: 'primary.main', mx: 'auto', width: '50%' }} />
                    </Grid>
                    {/* Address, Phone, Email */}
                    <Grid item xs={12} textAlign="center">
                        <Grid
                            container
                            spacing={2}
                            justifyContent="center"
                            alignItems="center"
                            sx={{ mb: 4 }}
                        >
                            <Grid item xs={12} md={4} textAlign="center">
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    <LocationOnIcon fontSize="large" color="primary" />
                                </Typography>
                                <Typography variant="body1">{isArabic ? clinicInfo.address.ar : clinicInfo.address.en}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4} textAlign="center">
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    <PhoneIcon fontSize="large" color="primary" />
                                </Typography>
                                <Typography variant="body1">{clinicInfo.phone}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4} textAlign="center">
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    <EmailIcon fontSize="large" color="primary" />
                                </Typography>
                                <Typography variant="body1">{clinicInfo.email}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>


                    {/* Embedded Map */}
                    <Grid item xs={12}>
                        <CardMedia
                            component="iframe"
                            src={clinicInfo?.mapLink}
                            height="450"
                            sx={{
                                width: '100%',
                                borderRadius: 2,
                                boxShadow: 3,
                                border: '2px solid',
                                borderColor: 'primary.main',
                            }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box >
    );
};

export default MapLocationSection;