import React from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import TopbarSection from '../components/home/TopbarSection';
import NotificationSection from '../components/home/NotificationSection';
import HeaderSection from '../components/home/HeaderSection';

import HeroSection from '../components/home/HeroSection';
import VideoSection from '../components/home/VideoSection';
import AboutSection from '../components/home/AboutSection';

import DetectBookingSection from '../components/home/DetectBookingSection';
import ServicesSection from '../components/home/ServicesSection';
import AppointmentSection from '../components/home/AppointmentSection';

import TeamSection from '../components/home/TeamSection';
import TestimonySection from '../components/home/TestimonySection';
import BeforeAfterGallery from '../components/home/BeforeAfterGallery';
import AchievementsSection from '../components/home/AchievementsSection';

import NewsletterSection from '../components/home/NewsletterSection';
import PricingSection from '../components/home/PricingSection';
import FAQSection from '../components/home/FAQSection';

import GallerySection from '../components/home/GallerySection';
import BlogSection from '../components/home/BlogSection';
import ContactSection from '../components/home/ContactSection';
import MapLocationSection from '../components/home/MapLocationSection';

import Footer from '../components/home/Footer';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import SocialPopup from '../components/common/SocialPopup';
import OfferPopup from '../components/common/OfferPopup';

const HomePage = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  return (
    <Box
      sx={{
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Navigation */}
      <HeaderSection />

      {/* Hero & Introduction */}
      {/* <HeroSection /> */}
      <VideoSection />
      <NotificationSection />
      <AboutSection />

      {/* Core Functionalities */}
      <DetectBookingSection />
      <ServicesSection />

      {/* Trust & Social Proof */}
      <TeamSection />
      <BeforeAfterGallery />
      <TestimonySection />
      <NewsletterSection />

      {/* Engagement & Offers */}
      <PricingSection />
      <AchievementsSection />
      <FAQSection />

      {/* Additional Content */}
      <GallerySection />
      <ContactSection />
      <BlogSection />
      <MapLocationSection />

      {/* Footer & Extras */}
      <Footer />
      <ScrollToTopButton />
      <SocialPopup />
      <OfferPopup />
    </Box>
  );
};

export default HomePage;
