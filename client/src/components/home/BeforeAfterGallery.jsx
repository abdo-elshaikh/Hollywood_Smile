import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ReactCompareImage from 'react-compare-image';
import axiosInstance from '../../services/axiosInstance';

const BeforeAfterGallery = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/before-after');
        setData(res.data.slice(-4)); // Get the last 4 patients
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        py: 8,
        px: 4,
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Title Section */}
      <Typography
        component={motion.h3}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        variant="h3"
        align="center"
        color="primary"
        sx={{ fontWeight: 'bold', mb: 3 }}
      >
        {t('BeforeAfterGallery.title')}
      </Typography>
      <Typography
        component={motion.p}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        variant="subtitle1"
        align="center"
        color="textSecondary"
        sx={{ mb: 2, maxWidth: 800, mx: 'auto' }}
      >
        {t('BeforeAfterGallery.description')}
      </Typography>
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
          width: 100,
          borderBottom: '4px solid',
          borderColor: 'primary.main',
          margin: '0 auto',
        }}
      />

      {/* Loading Indicator */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress size={50} />
        </Box>
      ) : (
        <Grid container spacing={4} sx={{ justifyContent: 'center', mt: 4 }}>
          {data.map((patient, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              component={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 3,
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 6 },
                }}
              >
                <ReactCompareImage
                  leftImage={patient.beforeImage}
                  rightImage={patient.afterImage}
                  aspectRatio="wider"
                  sliderLineColor={theme.palette.primary.main}
                  sliderLineWidth={3}
                  handleSize={50}
                  leftImageCss={{ height: 'auto' }}
                  rightImageCss={{ height: 'auto' }}
                  leftImageAlt="Before"
                  rightImageAlt="After"
                  leftImageLabel={t('BeforeAfterGallery.before')}
                  rightImageLabel={t('BeforeAfterGallery.after')}
                  leftImageLabelStyle={{
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                  }}
                  rightImageLabelStyle={{
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                  }}
                  skeleton={<CircularProgress />}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography
        variant="h6"
        sx={{
          mt: 2,
          textAlign: 'center',
          fontWeight: 'bold',
          color: theme.palette.primary.main,
        }}
      >
        {t('BeforeAfterGallery.extraInfo')}
      </Typography>

      {/* View More Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/before-after')}
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            borderRadius: 50,
            background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
            '&:hover': {
              background: 'linear-gradient(90deg, #21CBF3, #2196F3)',
            },
          }}
        >
          {t('BeforeAfterGallery.viewMore')}
        </Button>
      </Box>
    </Box>
  );
};

export default BeforeAfterGallery;
