import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Box,
    Typography,
    Grid,
    Button,
    Divider,
    Card,
    CardContent,
    CardMedia,
    useTheme,
} from "@mui/material";
import { Phone } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useClinicContext } from "../../contexts/ClinicContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { useCustomTheme } from "../../contexts/ThemeProvider";

const PricingSection = () => {
    const { t, i18n } = useTranslation();
    const { clinicInfo } = useClinicContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const { mode } = useCustomTheme();
    const darkMode = mode === "dark";
    const EN = i18n.language === "en";

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch offers from the API
    const fetchOffers = useCallback(async () => {
        try {
            const response = await axiosInstance.get("/offers");
            const offers = response.data.filter((offer) => offer.showInHome && new Date(offer.expiryDate) > Date.now());
            setOffers(offers);
        } catch (error) {
            console.error("Error fetching offers:", error);
            setError(t("common.fetchError"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    // Memoize pricing plans to avoid unnecessary recalculations
    const pricingPlans = useMemo(
        () =>
            offers.map((offer) => ({
                serviceId: offer.service?._id || offer.service,
                title: EN ? offer.title.en : offer.title.ar,
                price: offer.discount,
                image: offer.imageUrl,
                description: EN ? offer.description.en : offer.description.ar,
            })),
        [offers, EN]
    );

    // Render a single pricing plan card
    const renderPricingPlan = (plan, index) => (
        <SwiperSlide key={index}>
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
            >
                <Card
                    sx={{
                        position: "relative",
                        boxShadow: theme.shadows[3],
                        borderRadius: 2,
                        m: 2,
                        height: "100%",
                        backgroundColor: darkMode ? "#333" : "#F9F9F9",
                        borderBottom: `3px solid ${theme.palette.primary.main}`,
                    }}
                >
                    <CardMedia
                        component="img"
                        height="250"
                        image={plan.image}
                        alt={plan.title}
                        sx={{ objectFit: "cover" }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            top: "250px",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 1,
                            bgcolor: "secondary.main",
                            boxShadow: 2,
                            p: 1.7,
                            borderRadius: '50%',
                        }}
                    >
                        <Typography variant="h4" color="common.white">
                            {plan.price}
                        </Typography>
                    </Box>
                    <CardContent sx={{ textAlign: "center", pt: 6, pb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            {plan.title}
                        </Typography>
                        <Divider sx={{ my: 2, mx: "auto", width: "50%" }} />
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {plan.description}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, width: "100%" }}
                            onClick={() => navigate(`/services/${plan.serviceId}`)}
                            aria-label={EN ? "Book Now" : "احجز الآن"}
                        >
                            {EN ? "Book Now" : "احجز الآن"}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </SwiperSlide>
    );

    return (
        <Box py={5} px={{ xs: 2, md: 8 }}>
            <Grid container spacing={5} alignItems="center">
                {/* Left Section */}
                <Grid item xs={12} md={5}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Typography
                            variant="h3"
                            color="primary"
                            fontWeight="bold"
                        >
                            {EN ? 'Special Offers' : 'عروض خاصة'}
                        </Typography>
                        <Typography variant="h3" sx={{ mb: 3, fontFamily: "Cairo" }}>
                            {EN ? "We Offer Fair Prices for Dental Treatment" : "نحن نقدم أسعارًا عادلة لعلاج الأسنان"}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" sx={{ mb: 4 }}>
                            {EN
                                ? "We offer a wide range of dental services at affordable prices. Our team of expert dentists are here to provide you with the best dental care."
                                : "نحن نقدم مجموعة واسعة من الخدمات الطبية بأسعار معقولة. فريقنا من أطباء الأسنان المتخصصين هنا لتقديم أفضل رعاية صحية."
                            }
                        </Typography>
                        <Divider sx={{ mb: 4 }} />
                        <Typography
                            variant="h5"
                            color="primary"
                            fontWeight="bold"
                            sx={{ textTransform: "uppercase", mb: 2, fontFamily: "Cairo", letterSpacing: 1.2 }}
                        >
                            {EN ? "Call for Appointment" : "اتصل للحجز"}
                        </Typography>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <Typography variant="h3" sx={{ mb: 3, fontFamily: "Cairo", fontWeight: "bold", cursor: "pointer" }}>
                                <Phone sx={{ mx: 1, fontSize: "1.5rem", color: "primary.main" }} />
                                <a href={`tel:${clinicInfo.phone}`} style={{ color: theme.palette.primary.main, textDecoration: "none" }}>
                                    {clinicInfo.phone}
                                </a>
                            </Typography>
                        </motion.div>
                    </motion.div>
                </Grid>

                {/* Right Section */}
                <Grid item xs={12} md={7}>
                    {loading ? (
                        <Typography variant="h6" textAlign="center">
                            {t("common.loading")}
                        </Typography>
                    ) : error ? (
                        <Typography variant="h6" color="error" textAlign="center">
                            {error}
                        </Typography>
                    ) : (
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            autoplay={{ delay: 3000 }}
                            spaceBetween={10}
                            slidesPerView={1}
                            slidesPerGroup={1}
                            loop={true}
                            breakpoints={{
                                600: { slidesPerView: 2 },
                            }}
                        >
                            {pricingPlans.map((plan, index) => renderPricingPlan(plan, index))}
                        </Swiper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default PricingSection;