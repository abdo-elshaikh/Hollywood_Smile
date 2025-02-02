import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Grid,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import axiosInstance from "../../services/axiosInstance";

const OffersSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axiosInstance.get("/offers");
        setOffers(response.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: isArabic ? "right" : "left",
      }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, color: "primary.main" }}>
          {t("offersSection.title")}
        </Typography>
      </motion.div>
      <Typography variant="subtitle1" sx={{ mb: 8, color: "text.secondary", maxWidth: 700 }}>
        {t("offersSection.description")}
      </Typography>

      <Grid container justifyContent="center">
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
          {offers.map((offer) => (
            <SwiperSlide key={offer._id}>
              <DentalCard
                title={isArabic ? offer.title.ar : offer.title.en}
                subtitle={isArabic ? offer.description.ar : offer.description.en}
                discount={offer.discount}
                imgSrc={offer.imageUrl}
                serviceId={offer.service}
                contactText={t("offersSection.contact")}
                buttonText={t("offersSection.buttonText")}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>
    </Container>
  );
};

const DentalCard = ({
  title,
  subtitle,
  discount,
  contactText,
  imgSrc,
  buttonText,
  serviceId,
}) => {
  const navigate = useNavigate();

  const handleOfferClick = () => {
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
        border: `1px solid`,
        borderColor: "divider",
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        minHeight: 400,
        m: 2,
        p: 2,
        borderRadius: 2,
        overflow: "hidden",
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
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        {subtitle}
      </Typography>
      {discount && (
        <Box
          sx={{
            backgroundColor: "secondary.main",
            borderRadius: "50%",
            color: "#fff",
            px: 2,
            py: 2,
            fontWeight: "bold",
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 1,
            boxShadow: 3,
          }}
        >
          {discount}
        </Box>
      )}
      <Stack spacing={1} direction="column" justifyContent="center" sx={{ mt: "auto" }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleOfferClick}
          sx={{
            borderColor: "primary.main",
            color: "primary.main",
            fontWeight: 600,
            "&:hover": { backgroundColor: "primary.dark", color: "#fff" },
          }}
        >
          {buttonText}
        </Button>
      </Stack>
    </Box>
  );
};

export default OffersSection;
