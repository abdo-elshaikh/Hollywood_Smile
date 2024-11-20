import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Chip, Divider, ToggleButton, ToggleButtonGroup, CircularProgress, TextField } from '@mui/material';
import galleryService from '../services/galleryService';
import { useTranslation } from 'react-i18next';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import MainHeaderPages from '../components/common/MainHeaderPages';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import { motion } from 'framer-motion';
import bgVideo from '../assets/videos/smile-girl3.mp4';

const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [activeFilter, setActiveFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGalleryItems = async () => {
            try {
                const data = await galleryService.getGallery();
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setImages(sortedData);
                setFilteredImages(sortedData);
                const allCategories = data.flatMap((item) => item.categories);
                const allTags = data.flatMap((item) => item.tags);
                setCategories([...new Set(allCategories)]);
                setTags([...new Set(allTags)]);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching gallery items:", error);
            }
        };
        fetchGalleryItems();
    }, []);

    useEffect(() => {
        // Filter images based on search query
        if (searchQuery) {
            setFilteredImages(
                images.filter((img) =>
                    img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    img.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredImages(images);
        }
    }, [searchQuery, images]);

    const handleFilterChange = (type, value = '') => {
        setFilterType(type);
        setActiveFilter(value);

        if (activeFilter === value) {
            setActiveFilter('');
            setFilteredImages([]);
        }

        if (type === 'all') {
            setFilteredImages(images);
        } else if (type === 'category') {
            setFilteredImages(images.filter((img) => img.categories.includes(value)));
        } else if (type === 'tag') {
            setFilteredImages(images.filter((img) => img.tags.includes(value)));
        } else {
            setFilteredImages(images);
        }
    };

    const gridItemSize = (index) => (index % 4 === 0 ? 6 : 3);


    return (
        <Box sx={{ minHeight: '100vh' }}>
            <HeaderSection />
            <MainHeaderPages page="Gallery" title={t('galleryPage.title')} src={bgVideo} />
            <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
                <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
                    {t('galleryPage.title')}
                </Typography>

                {/* Search Bar */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <TextField
                        variant="outlined"
                        placeholder={t('galleryPage.searchPlaceholder')}
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ maxWidth: 600 }}
                    />
                </Box>

                {/* Filter Toggle */}
                <ToggleButtonGroup
                    value={filterType}
                    color="primary"
                    exclusive
                    onChange={(e, newType) => handleFilterChange(newType)}
                    sx={{ display: 'flex', justifyContent: 'center', mb: 2, flexDirection: isArabic ? 'row-reverse' : 'row' }}
                    size="large"
                >
                    <ToggleButton value="all">{t('galleryPage.all')}</ToggleButton>
                    <ToggleButton value="category">{t('galleryPage.categories')}</ToggleButton>
                    <ToggleButton value="tag">{t('galleryPage.tags')}</ToggleButton>
                </ToggleButtonGroup>

                {/* Category or Tag Chips */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, flexWrap: 'wrap', gap: 1.5 }}>
                    {filterType === 'category' &&
                        categories.map((category) => (
                            <Chip
                                key={category}
                                label={category}
                                onClick={() => handleFilterChange('category', category)}
                                color={activeFilter === category ? 'primary' : 'default'}
                                variant={activeFilter === category ? 'filled' : 'outlined'}
                            />
                        ))}
                    {filterType === 'tag' &&
                        tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                onClick={() => handleFilterChange('tag', tag)}
                                color={activeFilter === tag ? 'primary' : 'default'}
                                variant={activeFilter === tag ? 'filled' : 'outlined'}
                            />
                        ))}
                </Box>
                <Divider sx={{ mb: 4 }} />

                {/* Loading State */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {filteredImages.map((item, index) => (
                            <Grid item xs={12} sm={gridItemSize(index)} md={gridItemSize(index)} key={item._id}>
                                <motion.div
                                    initial="initial"
                                    animate="animate"
                                    whileHover="whileHover"

                                    variants={{
                                        initial: { opacity: 0, x: Math.random(), y: Math.random(), scale: Math.random() },
                                        animate: { opacity: 1, x: 0, y: 0, scale: 1, duration: 3, delay: index * 0.2 },
                                        whileHover: { opacity: 1, x: Math.random(), y: Math.random(), scale: 1.5 },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 400,
                                            borderRadius: 0,
                                            position: 'relative',
                                            cursor: 'pointer',
                                            backgroundImage: `url(${item.imageUrl})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            overflow: 'hidden',
                                        }}
                                        onClick={() => navigate(`/gallery/${item._id}`)}
                                    >
                                        <Box
                                            component={motion.div}
                                            whileHover={{ scale: 1.2 }}
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                bgcolor: 'rgba(0, 0, 0, 0.3)',
                                                opacity: 0,
                                                transition: 'opacity 0.4s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '&:hover': { opacity: 1 },
                                            }}
                                        />

                                        <Box
                                            component={motion.div}
                                            whileHover={{ scale: 1.2 }}
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                bgcolor: 'rgba(0, 0, 0, 0.3)',
                                                opacity: 0,
                                                transition: 'opacity 0.4s ease',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '&:hover': { opacity: 1 },
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                {t('galleryPage.viewDetails')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
            <Footer />
            <ScrollToTopButton />
        </Box>
    );
};

export default GalleryPage;
