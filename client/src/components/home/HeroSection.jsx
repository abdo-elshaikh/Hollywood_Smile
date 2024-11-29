import React from "react";
import {
    Box,
    Typography,
    Button,
    Container,
    Stack,
    useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Navigation,
    Pagination,
    A11y,
    EffectFade,
    Autoplay,
} from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../../contexts/ThemeProvider";

const baseUrl = `${import.meta.env.VITE_SUPABASE_VIEW_URL}/uploads/slides`;
const slides = [
    `${baseUrl}/slide_1.jpg`,
    `${baseUrl}/slide_2.jpg`,
    `${baseUrl}/slide_3.jpg`,
];

const HeroSection = () => {
    const { t, i18n } = useTranslation();
    const { mode } = useCustomTheme();
    const theme = useTheme();
    const navigate = useNavigate();
    const isArabic = i18n.language === "ar";
    const isDark = mode === "dark";

    return (
        <Box
            sx={{
                position: "relative",
                height: { xs: "80vh", md: "90vh" },
                overflow: "hidden",
            }}
        >
            <Swiper
                modules={[Navigation, Pagination, A11y, EffectFade, Autoplay]}
                centeredSlides
                loop
                effect="fade"
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                }}
                style={{ height: "100%" }}
                dir={isArabic ? "rtl" : "ltr"}
                className="mySwiper"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <Box
                            sx={{
                                position: "relative",
                                height: "100vh",
                                width: "100%",
                                backgroundImage: `url(${slide})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                color: "white",
                                textAlign: "center",
                                "&:before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    bgcolor: "rgba(0,0,0,0.2)",
                                    zIndex: 1,
                                },
                            }}
                        >
                            <Container
                                maxWidth="md"
                                sx={{
                                    zIndex: 2,
                                    position: "relative",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    px: 2,
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1 }}
                                >
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "primary.main",
                                            fontSize: {
                                                xs: theme.typography.pxToRem(40),
                                                md: theme.typography.pxToRem(60),
                                            },
                                            lineHeight: { xs: 1.2, md: 1.5 },
                                            textShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
                                        }}
                                    >
                                        {t(`heroSection.slide${index + 1}.title`)}
                                    </Typography>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1.2 }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: "white",
                                            fontSize: {
                                                xs: theme.typography.pxToRem(18),
                                                md: theme.typography.pxToRem(24),
                                            },
                                            mt: 2,
                                            textShadow: "0px 3px 5px rgba(0, 0, 0, 0.5)",
                                        }}
                                    >
                                        {t(`heroSection.slide${index + 1}.description`)}
                                    </Typography>
                                </motion.div>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ mt: 4, gap: 2 }}
                                    justifyContent="center"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 1.4 }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={() => navigate("/booking")}
                                            aria-label={isArabic ? "احجز الآن" : "Book Now"}
                                        >
                                            {isArabic ? "احجز الآن" : "Book Now"}
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 1.6 }}
                                    >
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="large"
                                            onClick={() => navigate("/contact-us")}
                                            aria-label={isArabic ? "تواصل معنا" : "Contact Us"}
                                        >
                                            {isArabic ? "تواصل معنا" : "Contact Us"}
                                        </Button>
                                    </motion.div>
                                </Stack>
                            </Container>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default HeroSection;
