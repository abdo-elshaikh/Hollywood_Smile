import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Grid, CircularProgress, Paper, Button, IconButton } from '@mui/material';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import BlogPost from '../components/blog/BlogPost';
import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '../contexts/ThemeProvider';
import { ChevronRight } from '@mui/icons-material'; // Example icon for a button

const BlogPostPage = () => {
    const { t, i18n } = useTranslation();
    const { mode } = useCustomTheme();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            navigate('/not-found');
        }
    }, [id, navigate]);

    return (
        <>
            <HeaderSection />

            <Box
                sx={{
                    background: mode === 'dark' ? 'linear-gradient(45deg, #333, #222)' : 'linear-gradient(135deg, #C9E6F0, #f5f5f5)',
                    padding: { xs: "40px 0", sm: "50px 0" },
                    borderBottom: mode === 'dark' ? "1px solid #555" : "1px solid #ccc",
                    transition: "all 0.3s ease",
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        mt: 5,
                    }}
                >
                    <Paper
                        sx={{
                            padding: 5,
                            backgroundColor: mode === 'dark' ? "#444" : "#fff",
                            boxShadow: 3,
                            borderRadius: 3,
                            transition: "all 0.3s ease",
                            textAlign: 'center',
                            "&:hover": {
                                boxShadow: 6,
                            },
                        }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 'bold',
                                color: mode === 'dark' ? "#FFD700" : "#1976d2",
                                mb: 2,
                                fontFamily: "'Poppins', sans-serif",
                            }}
                        >
                            {i18n.language === 'ar' ? 'المدونة' : 'Blog'}
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                color: mode === 'dark' ? "#bbb" : "#333",
                                fontFamily: "'Roboto', sans-serif",
                            }}
                        >
                            {i18n.language === 'ar' ? 'مقالات مفيدة ومثيرة' : 'Useful and Exciting Articles'}
                        </Typography>
                    </Paper>
                </Container>
            </Box>

            {/* Blog Post Content */}
            <Container sx={{ padding: '50px 0' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <BlogPost id={id} />
                    </Grid>

                    {/* Sidebar Section (if needed) */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#1976d2" }}>
                                {i18n.language === 'ar' ? 'أحدث المقالات' : 'Latest Articles'}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                        padding: "10px",
                                        fontSize: "1rem",
                                        textTransform: "none",
                                        "&:hover": {
                                            backgroundColor: mode === 'dark' ? "#1976d2" : "#333",
                                            color: "#fff",
                                        },
                                    }}
                                >
                                    {i18n.language === 'ar' ? 'المزيد من المقالات' : 'More Posts'}
                                </Button>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ color: mode === 'dark' ? "#bbb" : "#333" }}>
                                        {i18n.language === 'ar' ? 'استكشاف المزيد' : 'Explore More'}
                                    </Typography>
                                    <IconButton sx={{ color: mode === 'dark' ? "#FFD700" : "#1976d2" }}>
                                        <ChevronRight />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Footer />
            <ScrollToTopButton />
        </>
    );
};

export default BlogPostPage;
