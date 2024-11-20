import React from 'react';
import { Box, Container, Grid, Link, Typography, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import logo from '../../assets/hollywood-logo.jpg';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from '../../contexts/ClinicContext';

const Footer = () => {
  const { mode } = useCustomTheme();
  const { t, i18n } = useTranslation();
  const { clinicInfo } = useClinicContext();
  const isArabic = i18n.language === 'ar';
  const isDark = mode === 'dark';

  const navigationLinks = [
    "home",
    "about",
    "services",
    "doctors",
    "blog",
    "booking",
    "faq",
    "contact"
  ];

  const services = [
    "Cosmetic Dentistry",
    "Dental Implants",
    "Orthodontics",
    "Teeth Whitening",
    "Veneers",
    "Root CanalTreatment",
    "Periodontics",
    "Oral Surgery",
    "Pediatric Dentistry",
    "Emergency Dentistry"
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Navigation Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography color='#C1713B' variant="h5" gutterBottom>
              {t('Footer.Navigation.title')}
            </Typography>
            <Divider sx={{ my: 1 }} />
            {navigationLinks.map((text) => (
              <Link
                key={text}
                href={text === 'home' ? '/' : `/${text}`}
                color="inherit"
                underline="hover"
                display="block"
                sx={{ mb: 1, '&:hover': { color: '#C1713B' } }}
              >
                {t(`Footer.Navigation.${text}`)}
              </Link>
            ))}
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography color='#C1713B' variant="h5" gutterBottom>
              {t('Footer.Services.title')}
            </Typography>
            <Divider sx={{ my: 1 }} />
            {services.map((text) => (
              <Link
                key={text}
                href="#"
                color="inherit"
                underline="hover"
                display="block"
                sx={{ mb: 1, '&:hover': { color: '#C1713B' } }}
              >
                {t(`Footer.Services.${text.replace(' ', '')}`)}
              </Link>
            ))}
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={5}>
            <Typography color='#C1713B' variant="h5" gutterBottom>
              {t('Footer.Contact.title')}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography mb={1} variant="body2">📍 {isArabic ? clinicInfo?.address.ar : clinicInfo?.address.en}</Typography>
            <Typography mb={1} variant="body2">📞 {`${clinicInfo.primaryContact} / ${clinicInfo.secondaryContact}`}</Typography>
            <Typography mb={1} variant="body2">✉️ {clinicInfo.email}</Typography>
            <Typography mb={1} variant="body2">🕒 {t('Footer.Contact.mondayToFriday')}</Typography>
          </Grid>
        </Grid>

        {/* Social Media Icons */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          {[ 
            { icon: <FacebookIcon />, color: '#3b5998' }, 
            { icon: <TwitterIcon />, color: '#1da1f2' }, 
            { icon: <InstagramIcon />, color: '#e1306c' }, 
            { icon: <LinkedInIcon />, color: '#0077b5' } 
          ].map(({ icon, color }, index) => (
            <IconButton
              key={index}
              aria-label={icon.type.displayName}
              href="#"
              sx={{
                color: isDark ? 'text.primary' : 'background.paper',
                '&:hover': {
                  color: color,
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s ease-in-out',
                },
                mx: 1,
              }}
            >
              {icon}
            </IconButton>
          ))}
        </Box>

        {/* Logo and Divider */}
        <Divider sx={{ my: 2 }} >
          <img
            src={logo}
            alt='Hollywood Smile Clinic'
            style={{
              objectFit: 'cover',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
              border: '2px solid #fff',
              width: '100px',
              height: '100px',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </Divider>

        {/* Copyright Section */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', pt: 2 }}>
          <Typography variant="body2" textAlign="center">
            &copy; {new Date().getFullYear()} {t('Footer.AllRightsReserved')} | {t('Footer.TermsOfUse')} | {t('Footer.PrivacyPolicy')}
          </Typography>
          <Typography variant="body2" textAlign="center">
            {t('Footer.MadeWith')} <span role="img" aria-label="heart">❤️</span> {t('Footer.By')} 
            <Link href="#" target="_blank" color="inherit"> Abdo Mhmd</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
