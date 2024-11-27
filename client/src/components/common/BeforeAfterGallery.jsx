import { useEffect, useState } from 'react';
import { Box, Card, CardMedia, Grid, Typography, Divider, Container } from '@mui/material';
import axiosInstance from '../../services/axiosInstance';
import { useTranslation } from 'react-i18next';

const BeforeAfterGallery = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [transformations, setTransformations] = useState([]);

    useEffect(() => {
        fetchTransformations();
    }, []);

    const fetchTransformations = async () => {
        try {
            const response = await axiosInstance.get('/before-after');
            const latestTransformations = response.data
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6);
            setTransformations(latestTransformations);
        } catch (error) {
            console.error('Error fetching transformations:', error);
        }
    };

    return (
        <Box sx={{ py: 5, textAlign: 'center', mx: 'auto', boxShadow: 'none', backgroundColor: 'background.paper', px: { xs: 2, md: 0 } }}>
            <Container>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        textTransform: 'uppercase',
                    }}
                >
                    {isArabic ? 'تغيرات قبل وبعد' : 'Before & After'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                    {isArabic
                        ? 'تصفح بعض الحالات التي تم علاجها من قبلنا'
                        : 'Browse some of the cases we treated'}
                </Typography>
                <Divider sx={{ my: 3, width: '60%', mx: 'auto', borderColor: 'rgb(250, 250, 250, 0.5)' }} />
                <Grid container spacing={4} justifyContent="center">
                    {transformations.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                }}
                            >
                                <Box sx={{ p: 2, textAlign: 'center', backgroundColor: 'rgb(250, 250, 250, 0.5)' }}>
                                    <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                        {item.title}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: 'center',
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={item.beforeImage}
                                        alt={t('Before Image')}
                                        sx={{
                                            width: { xs: '100%', sm: '50%' },
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRight: { sm: '1px solid', xs: 'none' },
                                            borderBottom: { xs: '1px solid', sm: 'none' },
                                            borderColor: 'divider',
                                        }}
                                    />
                                    <CardMedia
                                        component="img"
                                        image={item.afterImage}
                                        alt={t('After Image')}
                                        sx={{
                                            width: { xs: '100%', sm: '50%' },
                                            height: '200px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default BeforeAfterGallery;
