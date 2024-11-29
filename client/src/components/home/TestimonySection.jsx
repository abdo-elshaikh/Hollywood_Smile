import React, { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Box, Typography, Avatar, Container, Rating, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../services/axiosInstance";

const TestimonySection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const fetchTestimonials = async () => {
    try {
      const response = await axiosInstance.get("/testimonials");
      const dataFilter = response.data.filter((item) => item.show);
      setTestimonials(dataFilter);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);



  const cardData = useMemo(() => {
    return testimonials.map((item) => ({
      id: item._id,
      name: item.name,
      position: item.position,
      quote: item.quote,
      imgUrl: item.imageUrl,
      rating: item.rating,
    }));
  }, [testimonials, isArabic]);

  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      {/* Section Header */}
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}>
          {t("testimonials.title")}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
          {t("testimonials.description")}
        </Typography>
      </Box>

      <Grid container spacing={0}>
        {/* Testimonials Slider */}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={10}
          slidesPerView={2}
          breakpoints={{
            0: { slidesPerView: 1 },
            960: { slidesPerView: 2 },
          }}
          loop
          dir={isArabic ? "rtl" : "ltr"}
        >
          {cardData.map((item) => (
            <SwiperSlide key={item.id}>
              <TestimonyCard
                name={item.name}
                position={item.position}
                quote={item.quote}
                imgUrl={item.imgUrl}
                rating={item.rating}
                t={t}
                isArabic={isArabic}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>
    </Container>
  );
};

const TestimonyCard = ({ name, position, quote, imgUrl, rating, t, isArabic }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Box
      sx={{
        backgroundColor: "background.paper",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        p: 4,
        mb: 8,
        mx: 2,
        minHeight: 250,
        textAlign: isArabic ? "right" : "left",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ":hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease-in-out",
        },
      }}
    >
      {/* User Info */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar
          src={imgUrl}
          alt={name}
          sx={{
            width: 80,
            height: 80,
            border: "3px solid",
            borderColor: "primary.main",
            mr: isArabic ? 0 : 2,
            ml: isArabic ? 2 : 0,
          }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
            {t("testimonials.mr")} {name}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            {position}
          </Typography>
          <Rating
            value={rating}
            readOnly
            precision={0.5}
            sx={{ mt: 1, color: "primary.main" }}
          />
        </Box>
      </Box>

      {/* Testimonial Quote */}
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          fontStyle: "italic",
          lineHeight: 1.8,
          fontSize: "1rem",
        }}
      >
        "{quote}"
      </Typography>
    </Box>
  </motion.div>
);

export default TestimonySection;
