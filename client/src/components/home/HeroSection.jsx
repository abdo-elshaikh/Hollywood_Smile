import { Box, Container, Typography, Grid, useTheme, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, EffectFade, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useCustomTheme } from "../../contexts/ThemeProvider";


const baseUrl = import.meta.env.VITE_SUPABASE_VIEW_URL;

const slides = [
  {
    title: "heroSection.slide1.title",
    description: "heroSection.slide1.description",
    image: `${baseUrl}/uploads/slides/slide_1.jpg`,
  },
  {
    title: "heroSection.slide2.title",
    description: "heroSection.slide2.description",
    image: `${baseUrl}/uploads/slides/slide_2.jpg`,
  },
  {
    title: "heroSection.slide3.title",
    description: "heroSection.slide3.description",
    image: `${baseUrl}/uploads/slides/slide_3.jpg`,
  },
];

const HeroSection = () => {
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const isDark = mode === "dark";

  return (
    <Box
      sx={{
        height: "90vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          clipPath: "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)",
          backgroundColor: 'linear-gradient(45deg, #fff 0%, #333 10%, #333 10%, #333 10%, #333 10%, #333 10',
          opacity: 0.5,
          zIndex: -1
        }}
      />
      <Swiper
        modules={[Navigation, Pagination, A11y, EffectFade, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Grid
              container
              sx={{
                height: '100%',
                width: '100%',
                backgroundColor: 'transparent',
              }}
            >
              <Grid item xs={12} md={6}>
                <Container
                  maxWidth='sm'
                  sx={{
                    p: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  <Typography
                    align={isArabic ? 'right' : 'left'}
                    variant="h2"
                    component='h2'
                    fontWeight='bold'
                    color='primary.dark'
                  >
                    {t(slide.title)}
                  </Typography>
                  <Typography
                    align={isArabic ? 'right' : 'left'}
                    variant="h6"
                    component='body1'
                  >
                    {t(slide.description)}
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      mt: 2
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        borderRadius: '20px 0 20px 0',
                        p: 2
                      }}
                    >
                      {t('heroSection.booking')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{
                        borderRadius: '20px 0 20px 0',
                        p: 2
                      }}
                    >
                      {t('heroSection.call')}
                    </Button>
                  </Box>
                </Container>
              </Grid>
              <Grid item xs={12} md={6}
                sx={{
                  background: isDark ?
                    'linear-gradient(135deg, #fff, #f5f5f5) ' : 'linear-gradient(135deg, #fff, #f5f5f5)',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    // top: '50%',
                    // left: '50%',
                    // transform: 'translateX(-50%)',
                    // width: 200,
                    // height: 300,
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Grid>
            </Grid>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default HeroSection;