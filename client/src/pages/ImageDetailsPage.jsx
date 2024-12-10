import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  IconButton,
  Divider,
  Stack,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Share, ThumbUp, Favorite, NavigateBefore } from '@mui/icons-material';
import galleryService from '../services/galleryService';
import Footer from '../components/home/Footer';
import BlogShareDialog from '../components/common/BlogShareDialog';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import HeaderSection from '../components/home/HeaderSection';

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

  // Handle actions
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

  const imageClick = () => {
    window.open(image.imageUrl, '_blank');
  };

  const goBack = () => navigate(-1);

  return (
    <>
      <HeaderSection />
      <Box sx={{ minHeight: '100vh', mt: 8 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Image Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  image={image.imageUrl}
                  alt={image.title}
                  sx={{
                    height: { xs: '300px', md: '500px' },
                    objectFit: 'cover',
                    cursor: 'pointer',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.03)' },
                  }}
                  onClick={imageClick}
                />
              </Card>
            </Grid>

            {/* Details Section */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {image.title || (isArabic ? 'لا يوجد عنوان' : 'No title available')}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {image.photographer || (isArabic ? 'لا يوجد مصور' : 'No photographer specified')}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {image.description || (isArabic ? 'لا يوجد وصف' : 'No description available')}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1} sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>{t('galleryPage.date')}:</strong>{' '}
                    {image.createdAt ? new Date(image.createdAt).toLocaleDateString() : '-'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t('galleryPage.time')}:</strong>{' '}
                    {image.createdAt ? new Date(image.createdAt).toLocaleTimeString() : '-'}
                  </Typography>
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} justifyContent="center">
                  <IconButton color="primary" onClick={likeImage}>
                    <ThumbUp /> <Typography variant="caption">({image.likes || 0})</Typography>
                  </IconButton>
                  <IconButton color="error" onClick={favoriteImage}>
                    <Favorite /> <Typography variant="caption">({image.loves || 0})</Typography>
                  </IconButton>
                  <BlogShareDialog blog={image} />
                </Stack>

                {/* Back Button */}
                <Button
                  variant="contained"
                  onClick={goBack}
                  startIcon={<NavigateBefore />}
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  {t('galleryPage.goBack')}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default ImageDetailsPage;
