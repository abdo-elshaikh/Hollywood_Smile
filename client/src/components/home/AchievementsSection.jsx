import React from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    useTheme,
} from "@mui/material";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import { useClinicContext } from "../../contexts/ClinicContext";
import { useTranslation } from "react-i18next";
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
    Handyman,
    BookOnline,
} from "@mui/icons-material";

const iconList = {
    "Thumb Up": <ThumbUpOffAltSharp color="primary" fontSize="large" />,
    Happy: <EmojiEmotionsSharp color="primary" fontSize="large" />,
    People1: <EmojiPeopleSharp color="primary" fontSize="large" />,
    Stats: <EqualizerSharp color="primary" fontSize="large" />,
    Idea: <EmojiObjectsSharp color="primary" fontSize="large" />,
    Medical: <MedicalServices color="primary" fontSize="large" />,
    Star: <Star color="primary" fontSize="large" />,
    People: <People color="primary" fontSize="large" />,
    Like: <ThumbUp color="primary" fontSize="large" />,
    Doctor: <Handyman color="primary" fontSize="large" />,
    Book: <BookOnline color="primary" fontSize="large" />,
};

const AchievementsSection = () => {
    const { t, i18n } = useTranslation();
    const { mode } = useCustomTheme();
    const { clinicInfo } = useClinicContext();
    const theme = useTheme();
    const isDark = mode === "dark";
    const isArabic = i18n.language === "ar";
    const achievements = clinicInfo?.achievements;

    return (
        <Box
            sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: theme.palette.text.primary,
                py: { xs: 4, sm: 6 },
                position: "relative",
            }}
        >
            {/* Section Title */}
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: "bold",
                        mb: 2,
                        color: theme.palette.common.white,
                    }}
                >
                    {t("AchievementsSection.title")}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 4,
                        color: theme.palette.common.white,
                        maxWidth: 600,
                        mx: "auto",
                    }}
                >
                    {t("AchievementsSection.description")}
                </Typography>
            </Container>

            {/* Achievements Cards */}
            <Container sx={{ position: "relative", zIndex: 1 }} maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">
                    {achievements?.map((achievement, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    textAlign: "center",
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: 4,
                                    height: "100%",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        boxShadow: 8,
                                    },
                                }}
                            >
                                <CardMedia
                                    component="div"
                                    sx={{
                                        height: 30,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: theme.palette.primary.main,
                                        mb: 2,

                                    }}
                                >
                                    <Typography fontSize={50} variant="h2">{iconList[achievement.icon]}</Typography>
                                </CardMedia>
                                <CardContent>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: "bold",
                                            color: theme.palette.secondary.main,
                                            mb: 1,
                                        }}
                                    >
                                        {achievement.number}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            mb: 1,
                                            color: isDark
                                                ? theme.palette.common.white
                                                : theme.palette.text.primary,
                                        }}
                                    >
                                        {isArabic ? achievement.label.ar : achievement.label.en}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: isDark
                                                ? theme.palette.grey[400]
                                                : theme.palette.text.secondary,
                                        }}
                                    >
                                        {isArabic ? achievement.description.ar : achievement.description.en}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default AchievementsSection;
