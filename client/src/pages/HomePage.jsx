import React, { useState, useEffect, useMemo } from 'react';
import NotificationSection from '../components/home/NotificationSection';
import HeaderSection from '../components/home/HeaderSection';
import HeroSection from '../components/home/HeroSection';
import AppointmentSection from '../components/home/AppointmentSection';
import ServicesSection from '../components/home/ServicesSection';
import MeetOurDentists from '../components/home/MeetOurDentists';
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
// import GoogleTranslate from '../components/common/GoogleTranslate';
// import Chat from '../components/common/Chat';
// import SendSMS from '../components/SendSMS';
// import SendEmail from '../components/SendEmail';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { i18n } = useTranslation();

  return (
    <Box
      sx={{
        direction: i18n.dir(),
        textAlign: i18n.dir() === 'rtl' ? 'right' : 'left',
      }}
    >
      <HeaderSection />
      <HeroSection />
      <NotificationSection />
      <AppointmentSection />
      <DetectBookingSection />
      <ServicesSection />
      <MeetOurDentists />
      <AchievementsSection />
      <OffersSection />
      <NewsletterSection />
      <TestimonySection />
      <FAQSection />
      <GallerySection />
      <BlogSection />
      <ContactSection />
      <BeforeAfterGallery />
      {/* <SmileLoveCare /> */}
      <MapLocationSection />
      <Footer />
      <ScrollToTopButton />
    </Box>
  );
};

export default HomePage;
