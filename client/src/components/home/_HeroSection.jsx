import { Box, Button, Container, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, EffectFade, Autoplay } from "swiper/modules";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import { useTranslation } from "react-i18next";

const baseUrl = import.meta.env.VITE_SUPABASE_VIEW_URL;

const slides = [
    `${baseUrl}/uploads/slides/slide_1.jpg`,
    `${baseUrl}/uploads/slides/slide_2.jpg`,
    `${baseUrl}/uploads/slides/slide_3.jpg`,
    `${baseUrl}/uploads/slides/slide_4.jpg`,
    `${baseUrl}/uploads/slides/slide_5.jpg`,
    `${baseUrl}/uploads/slides/slide_6.jpg`,
    `${baseUrl}/uploads/slides/slide_7.jpg`,
    `${baseUrl}/uploads/slides/slide_8.jpg`,
    `${baseUrl}/uploads/slides/slide_9.jpg`,
    `${baseUrl}/uploads/slides/slide_10.jpg`,
    `${baseUrl}/uploads/slides/slide_0.jpg`,
];

const MIN_SLIDES_FOR_LOOP = 5;

const slidesForLoop = slides.length < MIN_SLIDES_FOR_LOOP ? [...slides, ...slides] : slides;

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
                height: { xs: "60vh", sm: "80vh", md: "90vh" },
                overflow: "hidden",
            }}
        >
            <Swiper
                modules={[Navigation, Pagination, A11y, EffectFade, Autoplay]}
                slidesPerView={1}
                slidesPerGroup={1}
                centeredSlides
                loop={true}
                effect="fade"
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                style={{ height: "100%" }}
                dir={isArabic ? "rtl" : "ltr"}
                className="mySwiper"
            >
                {slidesForLoop.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <Box
                            sx={{
                                position: "relative",
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                textAlign: "center",
                                "&:before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    bgcolor: isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.3)",
                                    zIndex: 1,
                                },
                            }}
                        >
                            <img
                                src={slide}
                                loading="lazy" // Native lazy loading
                                alt={`Slide ${index + 1}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    position: "absolute",
                                    zIndex: 0,
                                }}
                            />
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
                                    py: 4,
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
                                                xs: theme.typography.pxToRem(35),
                                                sm: theme.typography.pxToRem(40),
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
                                                xs: theme.typography.pxToRem(20),
                                                sm: theme.typography.pxToRem(22),
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
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={2}
                                    sx={{
                                        mt: 4,
                                        gap: 2,
                                        justifyContent: "center",
                                    }}
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
                                            fullWidth={{ xs: true, sm: false }}
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
                                            fullWidth={{ xs: true, sm: false }}
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
