import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Card, CardContent, CardMedia, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import BeforeAfterSlider from 'react-before-after-slider';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/system';
import SquareIcon from '@mui/icons-material/Square';
import axiosInstance from '../../services/axiosInstance';
import BeforeAfter from '../common/BeforeAfter';

const ImageCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[5],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.08)',
    boxShadow: theme.shadows[10],
  },
}));

const Overlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6))',
  zIndex: 1,
});

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 25,
  padding: theme.spacing(1, 4),
  textTransform: 'none',
  fontWeight: 'bold',
  boxShadow: theme.shadows[2],
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const BeforeAfterGallery = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleToggleView = () => {
    setVisibleCount(showAll ? 3 : data.length);
    setShowAll(!showAll);
  };

  const demoData = [
    { beforeImage: '/images/before-after/ba1-before.jpg', afterImage: '/images/before-after/ba1-after.jpg', description: 'Lorem ipsum dolor sit amet' },
    { beforeImage: '/images/before-after/ba2-before.jpg', afterImage: '/images/before-after/ba2-after.jpg', description: 'Consectetur adipiscing elit' },
    { beforeImage: '/images/before-after/ba3-before.jpg', afterImage: '/images/before-after/ba3-after.jpg', description: 'Sed do eiusmod tempor incididunt' },
    { beforeImage: '/images/before-after/ba4-before.jpg', afterImage: '/images/before-after/ba4-after.jpg', description: 'Ut labore et dolore magna aliqua' },
    { beforeImage: '/images/before-after/ba5-before.jpg', afterImage: '/images/before-after/ba5-after.jpg', description: 'Ut enim ad minim veniam' },
    { beforeImage: '/images/before-after/ba5-before.jpg', afterImage: '/images/before-after/ba5-after.jpg', description: 'Quis nostrud exercitation ullamco' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/before-after');
        const data = res.data.length > 0 ? res.data : demoData;
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ backgroundColor: 'background.default', py: 10, px: 4, position: 'relative', zIndex: 1 }}>
      {/* Background Icons for Aesthetic Enhancement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 45 }}
        transition={{ duration: 1.5 }}
        style={{ position: 'absolute', bottom: 0, right: 0, zIndex: -1 }}
      >
        <SquareIcon sx={{ fontSize: 500, color: '#f07167', opacity: 0.1 }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: -45 }}
        transition={{ duration: 1.5 }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
      >
        <SquareIcon sx={{ fontSize: 500, color: '#f07167', opacity: 0.1 }} />
      </motion.div>

      {/* Title */}
      <Typography variant="h3" align="center" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
        {t('BeforeAfterGallery.title')}
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom sx={{ mb: 4 }}>
        {t('BeforeAfterGallery.description')}
      </Typography>

      {/* Loading Spinner */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress size={50} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {data.length > 0 && data.slice(0, visibleCount).map((patient, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ImageCard
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardMedia>
                 <BeforeAfterSlider
                    before={patient.beforeImage}
                    after={patient.afterImage}
                    width={window.innerWidth < 600 ? 300 : 500}
                    height={300}
                    beforeProps={{ alt: 'Before', after: 'After' }}
                    afterProps={{ alt: 'After', before: 'Before' }}
                  />
                </CardMedia>
                <CardContent
                  sx={{
                    textAlign: 'center',
                    zIndex: 2,
                    color: 'white',
                    position: 'relative',
                    py: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  }}>
                  <Overlay />
                  <Typography variant="subtitle2" color="inherit">{patient.description.slice(0, 100)}...</Typography>
                </CardContent>
              </ImageCard>
            </Grid>
          ))}
        </Grid>
      )}

      {data.length === 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" align="center" mt={5}>
            {t('BeforeAfterGallery.noData')}
          </Typography>
        </motion.div>
      )}

      {/* View More / View Less Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleToggleView}
        >
          {showAll ? t('BeforeAfterGallery.viewLess') : t('BeforeAfterGallery.viewMore')}
        </StyledButton>
      </Box>
    </Box>
  );
};

export default BeforeAfterGallery;
