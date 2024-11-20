import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Button, Paper, IconButton, Divider, Stack } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Share, ThumbUp, Favorite, NavigateBefore } from '@mui/icons-material';
import { motion } from 'framer-motion';
import galleryService from '../services/galleryService';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import BlogShareDialog from '../components/common/BlogShareDialog';
import ScrollToTopButton from '../components/common/ScrollToTopButton';

const ImageDetailsPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [image, setImage] = useState({});
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  // Fetch image details
  const fetchImage = async () => {
    try {
      const data = await galleryService.getGalleryItem(id);
      setImage(data);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [id]);

  // Handle actions (like, favorite, share)
  const likeImage = async () => {
    try {
      await galleryService.likeGalleryItem(id);
      fetchImage();
    } catch (error) {
      console.error('Error liking image:', error);
    }
  };

  const favoriteImage = async () => {
    try {
      await galleryService.LoveGalleryItem(id);
      fetchImage();
    } catch (error) {
      console.error('Error favoriting image:', error);
    }
  };

  const goBack = () => navigate(-1);

  // Image layout styling based on orientation
  const imageOrientation = image.width / image.height > 1 ? 'landscape' : 'portrait';

  return (
    <Box>
      <HeaderSection />

      {/* Hero Section with Image and Title */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '80vh',
          backgroundImage: `url(${image.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            color: 'white',
            padding: '20px',
            zIndex: 1,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {image.title}
          </Typography>
          <Typography variant="h5" sx={{ fontStyle: 'italic', mb: 3 }}>
            {image.photographer}
          </Typography>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4} direction={{ xs: 'column', md: 'row' }}>
          {/* Image Display Section */}
          <Grid item xs={12} md={7}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              sx={{
                boxShadow: 4,
                overflow: 'hidden',
                backgroundColor: 'white',
              }}
            >
              <img
                src={image.imageUrl}
                alt={image.title}
                style={{
                  width: '100%',
                  height: imageOrientation === 'portrait' ? 'auto' : '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Grid>

          {/* Sidebar Section for Image Details */}
          <Grid item xs={12} md={5}>
            <Paper elevation={5} sx={{ padding: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                {t('galleryPage.imageDetails')}
              </Typography>

              {/* Image Description */}
              <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                {image.description || (isArabic ? 'لا يوجد وصف' : 'No description available.')}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* Image Metadata */}
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>{t('galleryPage.date')} :</strong> {new Date(image.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  <strong>{t('galleryPage.time')} :</strong> {new Date(image.createdAt).toLocaleTimeString()}
                </Typography>
              </Stack>


              {/* Action Buttons */}
              <Stack direction="column" spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <Box display='flex' alignItems='center' justifyContent='center' gap={2}>
                  <IconButton color="primary" onClick={likeImage} sx={{ '&:hover': { transform: 'scale(1.1)' } }}>
                    <ThumbUp />
                  </IconButton>
                  <Typography variant="body2">{image.likes}</Typography>

                  <IconButton color="error" onClick={favoriteImage} sx={{ '&:hover': { transform: 'scale(1.1)' } }}>
                    <Favorite />
                  </IconButton>
                  <Typography variant="body2">{image.loves}</Typography>

                  <IconButton color="primary" sx={{ '&:hover': { transform: 'scale(1.1)' } }}>
                    <BlogShareDialog blog={image} />
                  </IconButton>
                </Box>
              </Stack>

              {/* Back Button */}
              <Button
                variant="outlined"
                color="info"
                onClick={goBack}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 2,
                }}
              >
                <NavigateBefore sx={{ mr: 1 }} />
                {t('galleryPage.goBack')}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Footer />
      <ScrollToTopButton />
    </Box>
  );
};

export default ImageDetailsPage;
