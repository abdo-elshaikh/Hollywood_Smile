import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Card, CardContent, CardMedia, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/system';
import SquareIcon from '@mui/icons-material/Square';
import { useSwipeable } from 'react-swipeable';
import axiosInstance from '../../services/axiosInstance';

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

const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSwipe = (delta) => {
    setSliderPosition((prev) => Math.max(0, Math.min(100, prev + delta)));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(-5),
    onSwipedRight: () => handleSwipe(5),
    trackMouse: true,
  });

  return (
    <Box
      {...handlers}
      sx={{
        position: 'relative',
        width: '100%',
        height: '300px',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Before Image */}
      <img
        src={beforeImage}
        alt="Before"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* After Image */}
      <img
        src={afterImage}
        alt="After"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${sliderPosition}%`,
          height: '100%',
          objectFit: 'cover',
          clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
        }}
      />

      {/* Divider */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: `${sliderPosition}%`,
          width: '5px',
          height: '100%',
          backgroundColor: 'white',
          transform: 'translateX(-50%)',
        }}
      />
    </Box>
  );
};

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

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/before-after');
        const data = res.data;
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
      {/* Title */}
      <Typography variant="h3" align="center" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
        {t('BeforeAfterGallery.title')}
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom sx={{ mb: 4 }}>
        {t('BeforeAfterGallery.description')}
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress size={50} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {data.slice(0, visibleCount).map((patient, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ImageCard
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardMedia>
                  <BeforeAfterSlider beforeImage={patient.beforeImage} afterImage={patient.afterImage} />
                </CardMedia>
                <CardContent
                  sx={{
                    textAlign: 'center',
                    zIndex: 2,
                    color: 'white',
                    position: 'relative',
                    py: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <Overlay />
                  <Typography variant="subtitle2" color="inherit">
                    {patient.description.slice(0, 100)}...
                  </Typography>
                </CardContent>
              </ImageCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <StyledButton variant="contained" color="primary" onClick={handleToggleView}>
          {showAll ? t('BeforeAfterGallery.viewLess') : t('BeforeAfterGallery.viewMore')}
        </StyledButton>
      </Box>
    </Box>
  );
};

export default BeforeAfterGallery;
