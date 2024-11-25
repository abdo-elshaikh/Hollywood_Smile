import React, { useState, useRef, useEffect, useMemo } from "react";
import Slider from "react-slick";
import { Box, Typography, Avatar, Container, Rating } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AdjustIcon from "@mui/icons-material/Adjust";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import axiosInstance from "../../services/axiosInstance";
import person1 from "../../assets/images/person_1.jpg";
import person2 from "../../assets/images/person_2.jpg";
import person3 from "../../assets/images/person_3.jpg";
import person4 from "../../assets/images/person_4.jpg";
import person5 from "../../assets/images/person_5.jpg";

const NextArrow = (props) => {
  const { className, style, onClick } = props; // Only extract relevant props
  return (
    <ArrowForwardIos
      onClick={onClick}
      sx={{
        ...style,
        color: "primary.main",
        fontSize: "2rem",
      }}
      className={className}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props; // Only extract relevant props
  return (
    <ArrowBackIos
      onClick={onClick}
      sx={{
        ...style,
        color: "primary.main",
        fontSize: "2rem",
      }}
      className={className}
    />
  );
};

// Testimony Section Component
const TestimonySection = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const sliderRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [testimonials, setTestimonials] = useState([]);

  const fetchTestimonials = async () => {
    try {
      const testimonials = await axiosInstance.get("/testimonials");
      const dataFilter = testimonials.data.filter((item) => item.show);
      setTestimonials(dataFilter);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // usememo hook
  const cardData = useMemo(() => {
    return testimonials.map((testimony) => ({
      id: testimony._id,
      name: testimony.name,
      position: testimony.position,
      quote: testimony.quote,
      imgUrl: testimony.imageUrl,
      rating: testimony.rating,
    }));
  }, [testimonials]);

  // Slider Settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    rtl: isArabic,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
    afterChange: (current) => setCurrentSlide(current),
    appendDots: (dots) => (
      <Box
        sx={{
          position: "absolute",
          bottom: "-30px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul style={{ margin: 0, padding: 0, display: "flex", gap: "8px" }}>
          {dots}
        </ul>
      </Box>
    ),
    customPaging: (i) => (
      <AdjustIcon
        key={i}
        sx={{
          color: i === currentSlide ? "#f07167" : "#6d6875",
          cursor: "pointer",
          transition: "color 0.3s ease-in-out",
          fontSize: "28px",
        }}
      />
    ),
    nextArrow: isArabic ? <PrevArrow /> : <NextArrow />,
    prevArrow: isArabic ? <NextArrow /> : <PrevArrow />,

  };




  return (
    <Container maxWidth={'lg'} sx={{ py: 10, position: "relative" }}>
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}>
          {t("testimonials.title")}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#6d6875" }}>
          {t("testimonials.description")}
        </Typography>
      </Box>

      <Box component={Container} mb={8} px={1} maxWidth="lg" position="relative">
        <Slider {...settings} ref={sliderRef}>
          {cardData.map((item) => (
            <TestimonyCard
              key={item.id}
              name={item.name}
              position={item.position}
              quote={item.quote}
              imgUrl={item.imgUrl}
              rating={item.rating}
              t={t}
              isArabic={isArabic}
            />
          ))}
        </Slider>
      </Box>
    </Container >
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
        minHeight: 300,
        p: 5,
        mb: 3,
        mx: 2,
        boxShadow: 1,
        bgcolor: "background.paper",
        textAlign: isArabic ? "right" : "left",
        position: "relative",
        overflow: "hidden",
        direction: isArabic ? "rtl" : "ltr",
      }}
    >
      {/* Left border indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: isArabic ? "unset" : 0,
          right: isArabic ? 0 : "unset",
          height: "100%",
          width: "5px",
          bgcolor: "#f07167",
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: isArabic ? "flex-end" : "flex-start",
          alignItems: "center",
          mb: 4,
          flexDirection: isArabic ? "row-reverse" : "row",
        }}
      >
        <Avatar
          src={imgUrl}
          alt={name.split(" ")[0].toUpperCase()}
          sx={{
            width: 80,
            height: 80,
            mr: isArabic ? 0 : 2,
            ml: isArabic ? 2 : 0,
            border: "2px solid",
            borderColor: "#f07167",
            objectFit: "cover",
            boxShadow: 3,
            order: isArabic ? 1 : 0,
          }}
        />
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "text.primary", fontSize: "1.3rem", mt: 0.5 }}
          >
            {t("testimonials.mr")} {name}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", fontSize: "1rem", mt: 0.5 }}
          >
            {position}
          </Typography>
          <Rating
            name="read-only"
            value={rating}
            readOnly
            precision={0.5}
            sx={{ mt: 1, color: "#f07167" }}
          />
        </Box>
      </Box>
      <Typography
        variant="body1"
        sx={{ mb: 3, color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.6 }}
      >
        {quote}
      </Typography>
    </Box>
  </motion.div>
);

export default TestimonySection;
