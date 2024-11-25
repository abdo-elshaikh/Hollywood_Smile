import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import BlogPost from '../components/blog/BlogPost';
import postVideo from '../assets/videos/blog-post.mp4';
import darkPostVideo from '../assets/videos/blog-post-dark.mp4';
import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '../contexts/ThemeProvider';

const BlogPostPage = () => {
    const { t } = useTranslation();
    const { mode } = useCustomTheme();
    const navigate = useNavigate();
    const { id } = useParams();
    const isDark = mode === 'dark';

    useEffect(() => {
        if (!id) {
            navigate('/not-found');
        }
    }, [id, navigate]);

          
    return (
        <>
            <HeaderSection />
            <Box sx={{ position: 'relative', mb: 4 }}>
                <video
                    autoPlay
                    loop
                    muted
                    style={{ width: '100%', height: '80vh', objectFit: 'cover' }}
                >
                    <source src={postVideo} type="video/mp4" />
                </video>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        color: 'white',
                    }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                        {t('blogPost')}
                    </Typography>
                    <Typography variant="h6" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                        {t('blogPostSubtitle')}
                    </Typography>
                </Box>
            </Box>
            <Container>
                <BlogPost id={id} />
            </Container>
            <Footer />
            <ScrollToTopButton />
        </>
    );
};

export default BlogPostPage;
