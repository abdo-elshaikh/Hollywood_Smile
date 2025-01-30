import React from 'react';
import NotificationSection from '../components/home/NotificationSection';
import TopbarSection from '../components/home/TopbarSection';
import HeaderSection from '../components/home/HeaderSection';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import AppointmentSection from '../components/home/AppointmentSection';
import ServicesSection from '../components/home/ServicesSection';
import MeetOurDentists from '../components/home/MeetOurDentists';
import TeamSection from '../components/home/TeamSection';
import AchievementsSection from '../components/home/AchievementsSection';
import PricingSection from '../components/home/PricingSection';
import NewsletterSection from '../components/home/NewsletterSection';
import TestimonySection from '../components/home/TestimonySection';
import GallerySection from '../components/home/GallerySection';
import BlogSection from '../components/home/BlogSection';
import ContactSection from '../components/home/ContactSection';
import MapLocationSection from '../components/home/MapLocationSection';
import FAQSection from '../components/home/FAQSection';
import OffersSection from '../components/home/OffersSection';
import FooterSection from '../components/home/FooterSection';
import BeforeAfterGallery from '../components/home/BeforeAfterGallery';
import SmileLoveCare from '../components/home/SmileLoveCare';
import ClientTestimonial from '../components/home/ClientTestimonial';
import DetectBookingSection from '../components/home/DetectBookingSection';
import Footer from '../components/home/Footer';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import VideoSection from '../components/home/VideoSection';

const HomePage = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  return (
    <Box
      sx={{
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <HeaderSection />
      <VideoSection />
      {/* <HeroSection /> */}
      <NotificationSection />
      <AboutSection />
      <DetectBookingSection />
      <ServicesSection />
      <TeamSection />
      <NewsletterSection />
      <PricingSection />
      <AchievementsSection />
      <TestimonySection />
      <GallerySection />
      <FAQSection />
      <BlogSection />
      <ContactSection />
      <BeforeAfterGallery />
      <MapLocationSection />
      <Footer />
      <ScrollToTopButton />
    </Box>
  );
};

export default HomePage;
