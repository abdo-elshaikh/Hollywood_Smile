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
import CountUp from "react-countup";
import { motion } from "framer-motion";

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
                background: isDark
                    ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                    : `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                color: theme.palette.text.primary,
                py: { xs: 4, sm: 6 },
                position: "relative",
            }}
        >
            {/* Section Title */}
            <Container maxWidth="lg" sx={{ textAlign: "center" }}>
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
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">
                    {achievements?.map((achievement, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -10 }}
                                transition={{ duration: index * 0.7, delay: 0.2, type: "spring" }}
                            >
                                <Card
                                    sx={{
                                        textAlign: "center",
                                        position: "relative",
                                        p: 3,
                                        borderRadius: "16px",
                                        boxShadow: 6,
                                        height: "100%",
                                        background: isDark
                                            ? theme.palette.grey[800]
                                            : theme.palette.common.white,
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    }}
                                >
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: 50,
                                            color: theme.palette.secondary.main,
                                        }}
                                    >
                                        {iconList[achievement.icon]}
                                    </CardMedia>

                                    <CardContent>
                                        <Typography
                                            variant="h1"
                                            sx={{
                                                fontWeight: "bold",
                                                color: theme.palette.secondary.main,
                                                mb: 1,
                                            }}
                                        >
                                            <CountUp
                                                start={0}
                                                end={achievement.number}
                                                duration={10}
                                            />
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: "bold",
                                                mb: 1,
                                                color: theme.palette.text.primary,
                                            }}
                                        >
                                            {isArabic ? achievement.label.ar : achievement.label.en}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default AchievementsSection;
