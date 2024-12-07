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

  // Handle actions (like, favorite)
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

  return (
    <>
      <HeaderSection />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', mt: 8, alignItems: 'center' }}>
        {/* Main Content */}
        <Container maxWidth="lg" sx={{ flex: 1, py: 4, mx: 'auto' }}>
          <Grid container spacing={4} alignItems="center" justifyContent="space-between">
            {/* Image Section */}
            <Grid item xs={12} md={6}>
              <Card
                elevation={6}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
                  position: 'relative',
                }}
              >
                <CardMedia
                  component="img"
                  image={image.imageUrl}
                  alt={image.title}
                  sx={{
                    height: { xs: '400px', md: '500px' },
                    objectFit: 'cover',
                    transition: 'filter 0.3s ease',
                    '&:hover': {
                      filter: 'brightness(90%)',
                    },
                  }}
                />
                <CardContent
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    color: '#fff',
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {image.title}
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <IconButton color="primary" onClick={likeImage} sx={{ color: '#fff' }}>
                      <ThumbUp />
                    </IconButton>
                    <IconButton color="error" onClick={favoriteImage} sx={{ color: '#fff' }}>
                      <Favorite />
                    </IconButton>
                    <IconButton sx={{ color: '#fff' }}>
                      <BlogShareDialog blog={image} />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Details Section */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(to right, #ffffff, #f8f8f8)',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {image.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    mb: 2,
                  }}
                >
                  {image.photographer || (isArabic ? 'لا يوجد مصور' : 'No photographer specified.')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {image.description || (isArabic ? 'لا يوجد وصف' : 'No description available.')}
                </Typography>
                <Divider sx={{ my: 2 }} />

                {/* Metadata */}
                <Stack spacing={1} sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>{t('galleryPage.date')}:</strong>{' '}
                    {new Date(image.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t('galleryPage.time')}:</strong>{' '}
                    {new Date(image.createdAt).toLocaleTimeString()}
                  </Typography>
                </Stack>

                {/* Back Button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={goBack}
                  startIcon={<NavigateBefore />}
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: 'primary.dark' },
                    width: '100%',
                    py: 1.5,
                  }}
                >
                  {t('galleryPage.goBack')}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTopButton />
    </>
  );
};

export default ImageDetailsPage;
