import React from "react";
import { Box, Typography, Button, Container, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import heroVideo from '../../assets/videos/hero-section.mp4';

const VideoSection = () => {
    const { i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                position: "relative",
                height: "90vh",  // Full screen height
                minWidth: "0",
                margin: "0 auto",
                overflow: "hidden",
            }}
        >
            {/* Video Background */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    zIndex: 1,
                }}
            >
                <Box
                    component="video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(0.9)",
                    }}
                >
                    <source src={heroVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </Box>
            </Box>

            {/* Overlay */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)",
                    zIndex: 2,
                }}
            ></Box>

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
                    gap: 4,
                    px: { xs: 2, sm: 4 },
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    {/* Centered Text with Call to Action */}
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 3,
                            fontSize: "1.5rem",
                            fontFamily: "cairo, sans-serif",
                            color: "secondary.main",
                            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)",
                            fontWeight: 600,
                        }}
                    >
                        {isArabic ? "مركز هوليوود سمايل" : "Hollywood Smile Center"}
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: "bold",
                            mb: 4,
                            fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                            color: "#fff",
                            textShadow: "3px 3px 12px rgba(0, 0, 0, 0.9)",
                        }}
                    >
                        {isArabic ? "أفضل مركز للعناية بالأسنان" : "Best Dental Care Center"}
                    </Typography>


                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/booking")}
                        sx={{
                            py: 1.5,
                            px: 4,
                            fontSize: "1.1rem",
                            fontWeight: 500,
                            letterSpacing: "1px",
                            borderRadius: "8px",
                            boxShadow: 3,
                            "&:hover": {
                                backgroundColor: "#1976d2",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                            },
                        }}
                    >
                        {isArabic ? "احجز موعدًا" : "Book Appointment"}
                    </Button>


                    {/* Additional Info */}
                    <Typography
                        variant="h6"
                        sx={{
                            mt: 3,
                            fontSize: "1.2rem",
                            color: "#fff",
                            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)",
                        }}
                    >
                        {isArabic
                            ? "نحن نقدم أفضل الخدمات الطبية لعلاج الأسنان بأحدث التقنيات وأفضل الأطباء"
                            : "We provide the best medical services for dental treatment with the latest technologies and the best doctors"}
                    </Typography>
                </motion.div>
            </Container>
        </Box>
    );
};

export default VideoSection;
