import React from 'react';
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
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
    'about-us',
    'services',
    'doctors',
    'blog',
    'booking',
    'faq',
    'contact-us',
  ];

  const services = [
    'Cosmetic Dentistry',
    'Dental Implants',
    'Orthodontics',
    'Teeth Whitening',
    'Veneers',
  ];

  return (
    <Box
      sx={{
        background: isDark
          ? 'linear-gradient(135deg, #333, #222)'
          : 'linear-gradient(135deg, #C9E6F0, #f5f5f5)',
        color: 'text.primary',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Navigation Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h5" color="#C1713B" gutterBottom>
              {t('Footer.Navigation.title')}
            </Typography>
            <Stack spacing={1}>
              {navigationLinks.map((text) => (
                <Link
                  key={text}
                  href={text === 'home' ? '/' : `/${text}`}
                  underline="hover"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': { color: '#C1713B' },
                  }}
                >
                  {t(`Footer.Navigation.${text}`)}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h5" color="#C1713B" gutterBottom>
              {t('Footer.Services.title')}
            </Typography>
            <Stack spacing={1}>
              {services.map((text) => (
                <Link
                  key={text}
                  href="/services"
                  underline="hover"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': { color: '#C1713B' },
                  }}
                >
                  {t(`Footer.Services.${text.replace(' ', '')}`)}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={5}>
            <Typography variant="h5" color="#C1713B" gutterBottom>
              {t('Footer.Contact.title')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              📍 {isArabic ? clinicInfo?.address?.ar : clinicInfo?.address?.en}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              📞 {`${clinicInfo.primaryContact} / ${clinicInfo.secondaryContact}`}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✉️ {clinicInfo.email}
            </Typography>
            <Typography variant="body2">
              🕒 {t('Footer.Contact.mondayToFriday')}
            </Typography>
          </Grid>
        </Grid>

        {/* Social Media Icons */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          {[
            { icon: <FacebookIcon />, color: '#3b5998', href: clinicInfo.socialLinks.facebook },
            { icon: <TwitterIcon />, color: '#1da1f2', href: clinicInfo.socialLinks.twitter },
            { icon: <InstagramIcon />, color: '#e1306c', href: clinicInfo.socialLinks.instagram },
            { icon: <LinkedInIcon />, color: '#0077b5', href: clinicInfo.socialLinks.linkedin },
          ].map(({ icon, color, href }, index) => (
            <IconButton
              key={index}
              href={href || '#'}
              sx={{
                color: 'text.primary',
                mx: 1,
                '&:hover': { color, transform: 'scale(1.2)' },
                transition: 'all 0.3s ease',
              }}
            >
              {icon}
            </IconButton>
          ))}
        </Box>

        {/* Divider with Logo */}
        <Divider sx={{ my: 4 }}>
          <img
            src={isDark ? clinicInfo?.logo?.dark : clinicInfo?.logo?.light}
            alt="Hollywood Smile Clinic"
            style={{
              borderRadius: '50%',
              border: '3px solid #C1713B',
              width: '100px',
              height: '100px',
            }}
          />
        </Divider>

        {/* Copyright Section */}
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" textAlign="center">
              &copy; {new Date().getFullYear()} {t('Footer.AllRightsReserved')} |{' '}
              {t('Footer.TermsOfUse')} | {t('Footer.PrivacyPolicy')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" textAlign="center">
              {t('Footer.MadeWith')} <span role="img" aria-label="heart">❤️</span>{' '}
              {t('Footer.By')}{' '}
              <Link href="https://www.linkedin.com/in/abdelrahman-mohamed-ahmed-56874a28a/" target="_blank" color="#C1713B">
                {isArabic ? 'عبدالرحمن محمد' : 'Abdelrahman Mohamed'}
              </Link>
            </Typography>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default Footer;
