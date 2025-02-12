import React, { lazy, Suspense } from "react";
import { Box, Typography, Button, Container, Divider, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Lazy load the Video component
const VideoBackground = lazy(() => import('./VideoBackground'));

const VideoSection = () => {
    const { i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                position: "relative",
                height: "85vh",
                width: "100%",
                margin: "0 auto",
                overflow: "hidden",
            }}
        >
            {/* Lazy-loaded Video Background */}
            <Suspense fallback={
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <CircularProgress color="primary" size={100} />
                </Box>
            }>
                <VideoBackground />
            </Suspense>

            {/* Darkened Overlay */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%)",
                    zIndex: 2,
                }}
            />

            {/* Content */}
            <Container
                sx={{
                    position: "relative",
                    zIndex: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    height: "100%",
                    gap: 3,
                    px: { xs: 2, sm: 4 },
                }}
            >
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 1,
                            fontSize: "1.7rem",
                            fontFamily: "Cairo, sans-serif",
                            color: "secondary.main",
                            textShadow: "2px 2px 10px rgba(0, 0, 0, 0.7)",
                            fontWeight: 700,
                        }}
                    >
                        {isArabic ? "مركز هوليوود سمايل" : "Hollywood Smile Center"}
                    </Typography>
                </motion.div>

                <Divider sx={{ height: 2, width: '15%', backgroundColor: "secondary.main" }} />

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: "bold",
                            fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                            color: "#fff",
                            textShadow: "4px 4px 15px rgba(0, 0, 0, 1)",
                        }}
                    >
                        {isArabic ? "أفضل مركز للعناية بالأسنان" : "Best Dental Care Center"}
                    </Typography>
                </motion.div>

                {/* Subtitle */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            fontSize: "1.2rem",
                            color: "#fff",
                            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)",
                        }}
                    >
                        {isArabic
                            ? "نحن نقدم أفضل الخدمات الطبية لعلاج الأسنان بأحدث التقنيات وأفضل الأطباء"
                            : "We provide top dental care with advanced technology and expert doctors."}
                    </Typography>
                </motion.div>

                {/* Call to Action Button */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/booking")}
                        sx={{
                            py: 1.5,
                            px: 4,
                            fontSize: "1.2rem",
                            fontFamily: '"Cairo Play", serif',
                            fontWeight: 600,
                            letterSpacing: "0.8px",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                                backgroundColor: "primary.dark",
                                transform: "scale(1.05)",
                                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.4)",
                            },
                        }}
                    >
                        {isArabic ? "احجز موعدًا" : "Book Appointment"}
                    </Button>
                </motion.div>
            </Container>
        </Box>
    );
};

export default VideoSection;