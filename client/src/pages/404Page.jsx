import React from 'react';
import { Box, Typography, Link, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const Error404Page = () => {
  const theme = useTheme();
  document.body.dir = 'ltr';

  // Animations for the colors
  const colorVariants1 = {
    animate: {
      color: ['#D1F2A5', '#F56991', '#FFC48C', '#EFFAB4', '#D1F2A5'],
      transition: { repeat: Infinity, duration: 4 },
    },
  };

  const colorVariants2 = {
    animate: {
      color: ['#FFC48C', '#EFFAB4', '#D1F2A5', '#F56991', '#FFC48C'],
      transition: { repeat: Infinity, duration: 4 },
    },
  };

  // Animation for the middle circle's shadow
  const shadowVariants = {
    animate: {
        boxShadow: [
            'inset 30px 0 0 rgba(209, 242, 165, 0.4), inset 0 30px 0 rgba(245, 105, 145, 0.4), inset -30px 0 0 rgba(255, 196, 140, 0.4), inset 0 -30px 0 rgba(239, 250, 180, 0.4)',
            'inset 30px 0 0 rgba(255, 196, 140, 0.4), inset 0 30px 0 rgba(209, 242, 165, 0.4), inset -30px 0 0 rgba(245, 105, 145, 0.4), inset 0 -30px 0 rgba(255, 196, 140, 0.4)',
            'inset 30px 0 0 rgba(245, 105, 145, 0.4), inset 0 30px 0 rgba(255, 196, 140, 0.4), inset -30px 0 0 rgba(209, 242, 165, 0.4), inset 0 -30px 0 rgba(245, 105, 145, 0.4)',
            'inset 30px 0 0 rgba(255, 196, 140, 0.4), inset 0 30px 0 rgba(245, 105, 145, 0.4), inset -30px 0 0 rgba(209, 242, 165, 0.4), inset 0 -30px 0 rgba(255, 196, 140, 0.4)',
            'inset 30px 0 0 rgba(209, 242, 165, 0.4), inset 0 30px 0 rgba(255, 196, 140, 0.4), inset -30px 0 0 rgba(245, 105, 145, 0.4), inset 0 -30px 0 rgba(209, 242, 165, 0.4)',
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
        404 Error Page
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The page you are looking for could not be found. Please go back to the home page.
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
          4
        </motion.span>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 5 }}>
        <Link
          href="/"
          sx={{
            textTransform: 'uppercase',
            fontSize: '16px',
            backgroundColor: '#FFB485',
            padding: '12px 24px',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '5px',
            mx: 1,
            '&:hover': {
              backgroundColor: '#FF8A3D',
            },
          }}
        >
          Go Back to Home
        </Link>
      </Box>
    </Box>
  );
};

export default Error404Page;
