import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Stack, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import axiosInstance from '../../services/axiosInstance';

// OffersSection component
const OffersSection = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await axiosInstance.get("/offers");
            setOffers(response.data);
        } catch (error) {
            console.error("Error fetching offers:", error);
        }
    };

    const offersList = offers.map((offer) => ({
        id: offer._id,
        title: isArabic ? offer.title.ar : offer.title.en,
        subtitle: isArabic ? offer.description.ar : offer.description.en,
        discount: offer.discount,
        imgSrc: offer.imageUrl,
        serviceId: offer.service,
        contactText: t("offersSection.contact"),
        buttonText: t("offersSection.buttonText"),
    }));

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: isArabic ? "right" : "left", // Adjust for RTL
            }}
        >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Typography variant="h3" sx={{ mb: 4, fontWeight: "700", color: "primary.main" }}>
                    {t("offersSection.title")}
                </Typography>
            </motion.div>
            <Typography variant="subtitle1" sx={{ mb: 8, color: "text.secondary", maxWidth: 700 }}>
                {t("offersSection.description")}
            </Typography>

            {/* Swiper with responsive settings */}
            <Grid container spacing={2} justifyContent="center">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                    effect="coverflow"
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    spaceBetween={10}
                    slidesPerView="auto"
                    navigation
                    pagination={{ clickable: true }}
                    loop
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        600: { slidesPerView: 2 },
                        900: { slidesPerView: 3 },
                    }}
                    dir={isArabic ? "rtl" : "ltr"}
                >
                    {offersList.map((offer) => (
                        <SwiperSlide key={offer.id}>
                            <DentalCard {...offer} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Grid>
        </Container>
    );
};

// DentalCard component
const DentalCard = ({ title, subtitle, discount, contactText, imgSrc, buttonText, id, serviceId }) => {
    const navigate = useNavigate();

    const getOfferClick = () => {
        if (serviceId) {
            navigate(`/booking/${serviceId}`);
        } else {
            alert("Coming Soon!");
        }
    };

    return (
        <Box
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
                backgroundColor: "background.paper",
                border: `1px solid divider`,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                minHeight: 450,
                m: 3,
                p: 2,
                overflow: "hidden",
                borderRadius: 2,
                mb: 8,
            }}
        >
            <Box
                component="img"
                src={imgSrc}
                alt={title}
                sx={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 2,
                }}
            />
            <Typography variant="h5" sx={{ fontWeight: "600", mb: 1 }}>
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                {subtitle}
            </Typography>
            {discount && (
                <Box
                    sx={{
                        backgroundColor: 'secondary.main',
                        borderRadius: '50%',
                        color: "#fff",
                        px: 2,
                        py: 2,
                        fontWeight: "bold",
                        position: "absolute",
                        top: 20,
                        right: 20,
                        zIndex: 1,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    {discount}
                </Box>
            )}
            <Stack spacing={2} direction="column" justifyContent="center" sx={{ mt: 2 }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={getOfferClick}
                    sx={{
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        "&:hover": { background: 'primary.dark', color: "#fff" },
                    }}
                >
                    {buttonText}
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        background: 'primary.main',
                        color: "#fff",
                        "&:hover": { background: 'primary.dark' },
                    }}
                    onClick={getOfferClick}
                >
                    {contactText}
                </Button>
            </Stack>
        </Box>
    );
};

export default OffersSection;
