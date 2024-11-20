import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const Error403Page = () => {
  const theme = useTheme();
  document.body.dir = 'ltr';

  // Animations for the colors
  const colorVariants1 = {
    animate: {
      color: ['#FFD5C2', '#FF6F61', '#D7A6D3', '#B6E2F3', '#FFD5C2'],
      transition: { repeat: Infinity, duration: 4 },
    },
  };

  const colorVariants2 = {
    animate: {
      color: ['#FF6F61', '#D7A6D3', '#B6E2F3', '#FFD5C2', '#FF6F61'],
      transition: { repeat: Infinity, duration: 4 },
    },
  };

  // Animation for the middle circle's shadow
  const shadowVariants = {
    animate: {
      boxShadow: [
        'inset 30px 0 0 rgba(255, 213, 194, 0.4), inset 0 30px 0 rgba(255, 111, 97, 0.4), inset -30px 0 0 rgba(215, 166, 211, 0.4), inset 0 -30px 0 rgba(182, 226, 243, 0.4)',
        'inset 30px 0 0 rgba(215, 166, 211, 0.4), inset 0 30px 0 rgba(255, 213, 194, 0.4), inset -30px 0 0 rgba(255, 111, 97, 0.4), inset 0 -30px 0 rgba(215, 166, 211, 0.4)',
        'inset 30px 0 0 rgba(255, 111, 97, 0.4), inset 0 30px 0 rgba(215, 166, 211, 0.4), inset -30px 0 0 rgba(255, 213, 194, 0.4), inset 0 -30px 0 rgba(255, 111, 97, 0.4)',
        'inset 30px 0 0 rgba(215, 166, 211, 0.4), inset 0 30px 0 rgba(255, 111, 97, 0.4), inset -30px 0 0 rgba(182, 226, 243, 0.4), inset 0 -30px 0 rgba(255, 213, 194, 0.4)',
        'inset 30px 0 0 rgba(182, 226, 243, 0.4), inset 0 30px 0 rgba(255, 213, 194, 0.4), inset -30px 0 0 rgba(215, 166, 211, 0.4), inset 0 -30px 0 rgba(255, 111, 97, 0.4)',
      ],
      transition: { repeat: Infinity, duration: 4 },
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: theme.palette.mode === 'dark' ? '#1c1c1c' : '#FFEDD5',
        color: theme.palette.text.primary,
        textAlign: 'center',
        padding: 2,
      }}
    >
      <Typography variant="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
        403 Forbidden
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You don't have permission to access this page. Please check your credentials.
      </Typography>

      {/* Error Number Container */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: { xs: '100px', md: '180px' },
          fontFamily: "'Catamaran', sans-serif",
          fontWeight: 800,
        }}
      >
        <motion.span variants={colorVariants1} animate="animate">
          4
        </motion.span>

        {/* Middle Circle */}
        <motion.span
          sx={{
            width: { xs: 60, md: 120 },
            height: { xs: 60, md: 120 },
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: { xs: '50px', md: '80px' },
            fontWeight: 'bold',
            position: 'relative',
          }}
          variants={shadowVariants}
          animate="animate"
        >
          0
        </motion.span>

        <motion.span variants={colorVariants2} animate="animate">
          3
        </motion.span>
      </Box>

      {/* Link Section */}
      <Box sx={{ mt: 5 }}>
        <Link
          href="/"
          sx={{
            textTransform: 'uppercase',
            fontSize: '16px',
            backgroundColor: '#FF6F61',
            padding: '12px 24px',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '5px',
            mx: 1,
            '&:hover': {
              backgroundColor: '#FF4D5A',
            },
          }}
        >
          Go Back to Home
        </Link>
      </Box>
    </Box>
  );
};

export default Error403Page;
