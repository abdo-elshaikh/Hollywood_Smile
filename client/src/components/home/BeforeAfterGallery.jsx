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
import ReactCompareImage from 'react-compare-image';
import axiosInstance from '../../services/axiosInstance';

const BeforeAfterGallery = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleToggleView = () => {
    setVisibleCount(showAll ? 3 : data.length);
    setShowAll(!showAll);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/before-after');
        setData(res.data);
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
          {data.slice(0, visibleCount).map((patient, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
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
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 6 },
                  height: '250px',
                }}
              >
                <ReactCompareImage
                  leftImage={patient.beforeImage}
                  rightImage={patient.afterImage}
                  aspectRatio="wider"
                  sliderLineColor={theme.palette.primary.main}
                  sliderLineWidth={3}
                  handleSize={40}
                  leftImageCss={{ borderRadius: '2px', height: '250px' }}
                  rightImageCss={{ borderRadius: '2px', height: '250px' }}
                  leftImageAlt="Before"
                  rightImageAlt="After"
                  leftImageLabel={t('BeforeAfterGallery.before')}
                  rightImageLabel={t('BeforeAfterGallery.after')}
                  skeleton={<CircularProgress />}
                />
              </Box>
              <Box
                sx={{
                  mt: 2,
                  px: 2,
                  py: 1,
                  backgroundColor: 'primary.light',
                  borderRadius: 2,
                  textAlign: 'center',
                  boxShadow: 1,
                }}
              >
                <Typography
                  variant="h6"
                  color="white"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  {patient.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Toggle Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleToggleView}
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            borderRadius: 50,
            background: "linear-gradient(90deg, #2196F3, #21CBF3)",
            "&:hover": {
              background: "linear-gradient(90deg, #21CBF3, #2196F3)",
            },
          }}
        >
          {showAll ? t('BeforeAfterGallery.viewLess') : t('BeforeAfterGallery.viewMore')}
        </Button>
      </Box>
    </Box>
  );
};

export default BeforeAfterGallery;
