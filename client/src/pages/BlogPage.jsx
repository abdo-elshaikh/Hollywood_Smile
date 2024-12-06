import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Container, Typography, TextField, Divider, Card, CardContent,
    Chip, CardMedia, Button, Grid, Link as MuiLink,
    useTheme, IconButton, Pagination
} from '@mui/material';
import { Circle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import MainHeaderPages from '../components/common/MainHeaderPages';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import MainContent from '../components/blog/MainContent';
import blogService from '../services/blogService';
import { useTranslation } from 'react-i18next';
import blodVideo from '../assets/videos/blog-smile.mp4';

const BlogPage = () => {
    const [page, setPage] = useState(1);
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [mostLiked, setMostLiked] = useState([]);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const theme = useTheme();

    useEffect(() => {
        document.body.dir = isArabic ? 'rtl' : 'ltr';
    }, [i18n.language]);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const data = await blogService.getBlogs();
            const sortedBlogs = data.filter(blog => blog.published).sort((a, b) => new Date(b.date) - new Date(a.date));
            const filteredBlogs = sortedBlogs.sort((a, b) => (b.likes + b.views + b.loves) - (a.likes + a.views + a.loves)).slice(0, 3);
            setMostLiked(filteredBlogs);
            setBlogs(sortedBlogs);
            setFilteredBlogs(sortedBlogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    useEffect(() => {
        setFilteredBlogs(
            searchQuery ? blogs.filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase())) : blogs
        );
    }, [searchQuery, blogs]);

    const categoryCounts = useMemo(() => {
        return blogs.reduce((acc, blog) => {
            blog.categories.forEach(category => {
                acc[category] = (acc[category] || 0) + 1;
            });
            return acc;
        }, {});
    }, [blogs]);

    const tags = Array.from(new Set(blogs.flatMap(blog => blog.tags)));
    const handleSearch = (event) => setSearchQuery(event.target.value);

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <HeaderSection />
            <MainHeaderPages page={t('blog.page')} title={t('blog.title')} src={blodVideo} />

            <Container maxWidth="xl" sx={{ mt: 4, mb: 8, display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Main Content */}
                <MainContent
                    blogEntries={filteredBlogs}
                    page={page}
                    rowsPerPage={10}
                    setPage={setPage}
                    categories={Object.keys(categoryCounts)}
                />
                {/* Sidebar */}
                <Box sx={{ width: { xs: '100%', md: '350px', lg: '400px' }, padding: 3, border: '1px solid', borderRadius: 2, boxShadow: theme.shadows[1] }}>
                    <Grid container spacing={2}>
                        {/* Search */}
                        <Grid item xs={12}>
                            <Typography variant="h6">{t('blog.search')}</Typography>
                            <TextField
                                fullWidth
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder={t('blog.searchPlaceholder')}
                                variant="outlined"
                                size="small"
                                sx={{ mt: 2, mb: 4 }}
                            />
                        </Grid>

                        {/* Categories */}
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                {t('blog.categories')}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {Object.entries(categoryCounts).map(([category, count]) => (
                                <Box key={category} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                    <MuiLink
                                        onClick={() => setFilteredBlogs(blogs.filter(blog => blog.categories.includes(category)))}
                                        sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'none' }}
                                    >
                                        <Circle sx={{ mr: 1, fontSize: '12px', color: 'primary.main' }} /> {category}
                                    </MuiLink>
                                    <Typography variant="caption">({count})</Typography>
                                </Box>
                            ))}
                        </Grid>

                        {/* Recent Blogs */}
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                {t('blog.popularBlogs')}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {mostLiked.map((blog, index) => (
                                <Card
                                    key={index}
                                    onClick={() => navigate(`/blog/post/${blog._id}`)}
                                    sx={{ display: 'flex', mb: 2, cursor: 'pointer', boxShadow: 0 }}
                                >
                                    <CardMedia component="img" sx={{ width: 80 }} image={blog.imageUrl} alt={blog.title} />
                                    <CardContent sx={{ paddingLeft: 2 }}>
                                        <Typography variant="subtitle2">
                                            {blog.title}
                                        </Typography>
                                        <Typography variant="body2">
                                            {t('blog.by')} - {blog.author?.name || 'Unknown'}
                                        </Typography>
                                        <Typography variant="caption">
                                            {t('blog.date')} {new Date(blog.date).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Grid>

                        {/* Tags */}
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                {t('blog.tags')}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {tags?.map((tag, index) => (
                                    <Chip key={index} label={tag} />
                                ))}
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Container>

            <Footer />
            <ScrollToTopButton />
        </Box>
    );
};

export default BlogPage;
