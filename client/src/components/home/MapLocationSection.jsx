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
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import headerImg from '../../assets/hero.jpg';
import headerimg from '../../assets/map.jpeg';
import mapHeader from '../../assets/videos/map-header.mp4';


const MapLocationSection = () => {
    const { clinicInfo } = useClinicContext();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    return (
        <Box
            sx={{
                bgcolor: 'background.default',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 400,
                    color: 'white',
                    backgroundAttachment: 'fixed',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    mb: 4,
                }}
            >
                {/* Video Background with Motion */}
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
                {/* Dark Gradient Overlay for Readability */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0,0,0,0.4)',
                        zIndex: 1,
                    }}
                />

                {/* Content Container */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                        {t('mapLocationSection.title')}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {t('mapLocationSection.description')}
                    </Typography>
                </Box>
            </Box>



            {/* Location Details */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 500,
                }}
            >
                <Grid
                    container
                    spacing={2}
                    bgcolor={'background.default'}
                    sx={{
                        backdropFilter: 'blur(10px)',
                        p: 2,

                    }}
                >
                    {/* Text Section */}
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center" gutterBottom>
                            {isArabic ? clinicInfo.name.ar : clinicInfo.name.en} - {isArabic ? "الفرع الرئيسي" : "Main Branch"}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" textAlign="center" paragraph>
                            {isArabic ? clinicInfo.description.ar : clinicInfo.description.en}
                        </Typography>
                        <Divider sx={{ color: 'primary.main' }} />
                    </Grid>
                    {/* Address, Phone, Email Section */}
                    <Grid item container spacing={0}>
                        <Grid item xs={12} md={4}>
                            <Box elevation={3} sx={{ p: 2 }}>
                                <Typography variant="body1" fontWeight="bold" gutterBottom>
                                    <LocationOnIcon /> {isArabic ? "العنوان:" : "Address:"}
                                </Typography>
                                <Link href="https://goo.gl/maps/Frb65JWf7tF6aXh49" target="_blank" rel="noopener" underline="hover">
                                    {isArabic ? clinicInfo.address.ar : clinicInfo.address.en}
                                </Link>
                            </Box>
                        </Grid>
                        <Divider orientation={'vertical'} flexItem />
                        <Grid item xs={12} md={3}>
                            <Box elevation={3} sx={{ p: 2 }}>
                                <Typography variant="body1" fontWeight="bold" gutterBottom>
                                    <PhoneIcon /> {isArabic ? "الهاتف:" : "Phone:"}
                                </Typography>
                                <Typography variant="body1">
                                    <Link href={`tel:${clinicInfo?.phone}`} underline="hover">{clinicInfo?.phone}</Link>
                                </Typography>
                            </Box>
                        </Grid>
                        <Divider orientation={'vertical'} flexItem />
                        <Grid item xs={12} md={4}>
                            <Box elevation={3} sx={{ p: 2 }}>
                                <Typography variant="body1" fontWeight="bold" gutterBottom>
                                    <EmailIcon /> {isArabic ? "البريد الإلكتروني:" : "Email:"}
                                </Typography>
                                <Link href={`mailto:${clinicInfo?.email}`} underline="hover">
                                    {clinicInfo?.email}
                                </Link>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Map Section */}
                    <Grid item xs={12}>
                        <CardMedia
                            component="iframe"
                            src={clinicInfo?.mapLink} // locations.iframeSrc
                            height="400"
                            sx={{
                                width: '100%',
                                borderRadius: 2,
                                boxShadow: 4,
                                border: '2px solid'
                            }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default MapLocationSection;
