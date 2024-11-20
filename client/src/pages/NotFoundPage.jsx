import React from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Animation variants for text and buttons
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.3 } },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f4f4f4',
        color: theme.palette.text.primary,
        textAlign: 'center',
      }}
    >
      {/* 404 Text */}
      <motion.div initial="hidden" animate="visible" variants={textVariants}>
        <Typography variant="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
          404 Not Found
        </Typography>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={textVariants}>
        <Typography variant="body1" sx={{ mb: 4 }}>
          The page you are looking for does not exist.
        </Typography>
      </motion.div>

      {/* Buttons */}
      <motion.div initial="hidden" animate="visible" variants={buttonVariants}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mx: 1 }}
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mx: 1 }}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </motion.div>

      {/* Link Section */}
      <motion.div initial="hidden" animate="visible" variants={buttonVariants}>
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Link
            href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404"
            target="_blank"
            sx={{
              textTransform: 'uppercase',
              fontSize: '13px',
              padding: '10px 15px',
              borderRadius: '5px',
              backgroundColor: '#666',
              color: '#fff',
              textDecoration: 'none',
              letterSpacing: 1,
            }}
          >
            Learn More About 404 Status Code
          </Link>
        </Box>
      </motion.div>
    </Box>
  );
};

export default NotFoundPage;
