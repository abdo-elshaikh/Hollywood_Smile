import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import axiosInstance from '../../services/axiosInstance';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useClinicContext } from '../../contexts/ClinicContext';
import { useTranslation } from 'react-i18next';
import {
    ThumbUpOffAltSharp,
    EmojiEmotionsSharp,
    EmojiPeopleSharp,
    EqualizerSharp,
    EmojiObjectsSharp,
    MedicalServices,
    Star,
    People,
    ThumbUp,
    MedicalInformation,
    Handyman,
    BookOnline,
} from "@mui/icons-material";

const iconList = {
    "Thumb Up": <ThumbUpOffAltSharp color="primary" fontSize="large" />,
    "Happy": <EmojiEmotionsSharp color="primary" fontSize="large" />,
    "People1": <EmojiPeopleSharp color="primary" fontSize="large" />,
    "Stats": <EqualizerSharp color="primary" fontSize="large" />,
    "Idea": <EmojiObjectsSharp color="primary" fontSize="large" />,
    "Medical": <MedicalServices color="primary" fontSize="large" />,
    "Star": <Star color="primary" fontSize="large" />,
    "People": <People color="primary" fontSize="large" />,
    "Like": <ThumbUp color="primary" fontSize="large" />,
    "Doctor": <Handyman color="primary" fontSize="large" />,
    "Book": <BookOnline color="primary" fontSize="large" />,
};

const AchievementsSection = () => {
    const { t, i18n } = useTranslation();
    const { mode } = useCustomTheme();
    const { clinicInfo } = useClinicContext();
    const isDark = mode === 'dark';
    const isArabic = i18n.language === 'ar';
    const achievements = clinicInfo?.achievements;

    return (
        <>
            <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                {t('AchievementsSection.title')}
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4 }}>
                {t('AchievementsSection.description')}
            </Typography>
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #3C9EE7, #34A69E)',
                    color: 'text.primary',
                    py: 6,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                        zIndex: 0,
                    },
                }}
            >

                <Container sx={{ position: 'relative', zIndex: 1 }} maxWidth="lg">
                    <Grid container spacing={4}>
                        {achievements?.slice(0, 4).map((achievement, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        textAlign: 'center',
                                        p: 3,
                                        borderRadius: 2,
                                        boxShadow: 3,
                                        height: '100%',
                                    }}
                                >
                                    <CardMedia>
                                        {iconList[achievement.icon]}
                                    </CardMedia>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {isArabic ? achievement.label.ar : achievement.label.en}
                                        </Typography>
                                        <Typography variant="h4" sx={{ color: 'secondary', fontWeight: 'bold' }}>
                                            {achievement.number}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {isArabic ? achievement.description.ar : achievement.description.en}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default AchievementsSection;
