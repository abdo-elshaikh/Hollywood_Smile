import React from "react";
import { Box, Typography, Button, Stack, Grid, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const baseUrl = import.meta.env.VITE_SUPABASE_VIEW_URL;
const heroImages = [
  `${baseUrl}/uploads/slides/slide_7.jpg`,
  `${baseUrl}/uploads/slides/slide_8.jpg`,
  `${baseUrl}/uploads/slides/slide_1.jpg`
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ alignItems: "center", mt: 8 }}>
          {/* Left Section: Text Content */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ maxWidth: "md", p: 2 }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "2rem", sm: "3.5rem", md: "4rem" },
                    lineHeight: 1.2,
                    color: "text.primary",
                    textShadow: "2px 2px 6px rgba(0,0,0,0.2)",
                    letterSpacing: "0.1rem",
                  }}
                >
                  Brighten Your Smile with Expert Care
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 400,
                    fontSize: { xs: "1rem", sm: "1.3rem" },
                    color: "text.secondary",
                    marginTop: "20px",
                    marginBottom: "30px",
                    lineHeight: 1.5,
                  }}
                >
                  Join thousands of satisfied patients who trust us for their dental health.
                  Our professional team ensures your comfort with the latest in dental technology.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={3}
                  sx={{
                    justifyContent: "flex-start",
                    gap: 3,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate("/book-appointment")}
                    sx={{
                      bgcolor: "primary.main",
                      ":hover": {
                        bgcolor: "#084298",
                      },
                      borderRadius: "50px",
                      paddingX: 4,
                      paddingY: 2,
                      boxShadow: "0px 8px 15px rgba(0,0,0,0.2)",
                      textTransform: "none",
                    }}
                  >
                    Book Your Appointment
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate("/services")}
                    sx={{
                      borderColor: "primary.main",
                      ":hover": {
                        bgcolor: "rgba(13, 110, 253, 0.1)",
                      },
                      borderRadius: "50px",
                      paddingX: 4,
                      paddingY: 2,
                      textTransform: "none",
                    }}
                  >
                    Explore Our Services
                  </Button>
                </Stack>
              </motion.div>
            </Box>
          </Grid>

          {/* Right Section: Swiper (Image Carousel) */}
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              >
                {heroImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <Box
                      component="img"
                      src={image}
                      alt={`Hero Image ${index}`}
                      sx={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: 2,
                        boxShadow: 6,
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
