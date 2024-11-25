import React, { useRef, useCallback } from "react";
import { Box, Typography, Button, Container, Stack, Dialog, } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useClinicContext } from "../../contexts/ClinicContext";

// Slider settings for the offers section
const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 2 } },
        { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
};

// Custom arrow components
const NextArrow = ({ className, style, onClick }) => (
    <ArrowForwardIos
        className={className}
        style={{ ...style, color: "#1976d2", fontSize: "2rem" }}
        onClick={onClick}
    />
);
const PrevArrow = ({ className, style, onClick }) => (
    <ArrowBackIos
        className={className}
        style={{ ...style, color: "#1976d2", fontSize: "2rem" }}
        onClick={onClick}
    />
);

// OffersSection component
const OffersSection = () => {
    const { t, i18n } = useTranslation();
    const { clinicOffers } = useClinicContext();
    const sliderRef = useRef(null);
    const isArabic = i18n.language === "ar";

    const offers = clinicOffers?.map((offer) => ({
        id: offer._id,
        title: isArabic ? offer.title.ar : offer.title.en,
        subtitle: isArabic ? offer.description.ar : offer.description.en,
        discount: offer.discount,
        imgSrc: offer.imageUrl,
        contactText: t("offersSection.contact"),
        buttonText: t("offersSection.buttonText"),
    }));

    const adjustedSliderSettings = {
        ...sliderSettings,
        rtl: isArabic,
        nextArrow: isArabic ? <PrevArrow /> : <NextArrow />,
        prevArrow: isArabic ? <NextArrow /> : <PrevArrow />,
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
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
            <Box component={Container} mb={8} px={1} maxWidth="lg" position="relative">
                <Slider ref={sliderRef} {...adjustedSliderSettings}>
                    {offers.map((offer) => (
                        <DentalCard key={offer.id} {...offer} />
                    ))}
                </Slider>
            </Box>
        </Container>
    );
};

// DentalCard component
const DentalCard = ({ title, subtitle, discount, contactText, imgSrc, buttonText, id }) => {
    const onButtonClick = useCallback(() => alert("Coming Soon!"), []);
    const navigate = useNavigate();

    const getOfferClick = () => {
        if (id) {
            navigate(`/booking`, { state: { serviceId: id } });
        } else {
            alert("Coming Soon!");
        }
    }

    return (
        <Box
            component={motion.div}
            whileHover={{ scale: 1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
                backgroundColor: "background.paper",
                border: `1px solid divider`,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                minHeight: 450,
                m: 3,
                p: 2,
                overflow: "hidden",
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
                    }}
                >
                    {discount}
                </Box>
            )}
            <Stack spacing={2} direction="row" justifyContent="center" sx={{ mt: "auto" }}>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => alert(`Coming Soon, Please ${contactText}!`)}
                    sx={{
                        background: 'primary.dark',
                        color: "#fff",
                        "&:hover": { background: 'primary.main' },
                    }}
                >
                    {contactText}
                </Button>
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
            </Stack>
        </Box>
    );
};

export default OffersSection;
