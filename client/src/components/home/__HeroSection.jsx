import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';
import heroImage from '../../assets/hero-person.png';
import heroBg from '../../assets/images/hero-comp.png';

const HeroSection = () => {
  const navigate = useNavigate();
  const { mode } = useCustomTheme();
  const { t } = useTranslation();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        background: isDark
          ? 'linear-gradient(135deg, #0D324D, #7F5A83)'
          : 'linear-gradient(135deg, #67B26F, #4ca2cd)',
        mt: '60px',
        height: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Overlay for improved text readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
          zIndex: 1,
        }}
      />
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          padding: { xs: '20px', md: '40px' },
        }}
      >
        <Grid container alignItems="center">
          {/* Text and Buttons Column */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                color: isDark ? '#f0f0f0' : '#333',
              }}
            >
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', md: '3rem' },
                    lineHeight: 1.2,
                    marginBottom: '20px',
                  }}
                >
                  {t('heroSection.slide1.title')}
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    marginBottom: '30px',
                    fontWeight: 300,
                  }}
                >
                  {t('heroSection.slide1.description')}
                </Typography>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    alignItems: 'center',
                    marginTop: '20px',
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: 'primary.main',
                      color: '#fff',
                      padding: '12px 30px',
                      borderRadius: '30px',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      boxShadow: '0px 4px 12px rgba(0,0,0,0.3)',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                    onClick={() => navigate('/contact')}
                    aria-label="Request Appointment"
                  >
                    {t('Request Appointment')}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      padding: '12px 30px',
                      borderRadius: '30px',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        color: 'primary.dark',
                        borderColor: 'primary.dark',
                      },
                    }}
                    href="tel:6019247441"
                    aria-label="Call: (601) 924-7441"
                  >
                    {t('Call: (601) 924-7441')}
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </Grid>

          {/* Image Column */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
                alignItems: 'center',
              }}
            >
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}>
                <img src={heroBg} alt="Dentist" style={{ width: '100%', borderRadius: '10px' }} />
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
