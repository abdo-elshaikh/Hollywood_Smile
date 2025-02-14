import React, { useEffect, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from './contexts/ClinicContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SupportDashboard = lazy(() => import('./pages/SupportDashboard'));
const BlogDashboard = lazy(() => import('./pages/BlogDashboard'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const BookingServicePage = lazy(() => import('./pages/BookingServicePage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const DoctorsPage = lazy(() => import('./pages/DoctorsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ImageDetailsPage = lazy(() => import('./pages/ImageDetailsPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ViewProfile = lazy(() => import('./pages/ViewProfile'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const BeforeAfterPage = lazy(() => import('./pages/BeforeAfterPage'));
const ClientBookings = lazy(() => import('./pages/ClientBookings'));
const Error404Page = lazy(() => import('./pages/404Page'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const Error403Page = lazy(() => import('./pages/403Page'));
const Error500Page = lazy(() => import('./pages/500Page'));
const LoadingSpinner = lazy(() => import('./components/common/LoadingSpinner'));
const ErrorBoundary = lazy(() => import('./components/common/ErrorBoundary'));
const RateDoctorPage = lazy(() => import('./pages/RateDoctorPage'));

import PrivateRoute from './components/PrivateRoute';
import OfferPopup from './components/common/OfferPopup';

import { Box } from '@mui/material';
import './i18n';


const ScrollToTop = () => {
  const location = useLocation();
  const { i18n } = useTranslation();


  // Memoize the page titles for different languages
  const pagesTitles = useMemo(() => ({
    '/': { ar: 'الرئيسية | مركز هوليود سمايل', en: 'Home | Hollywood Smile Center' },
    '/about-us': { ar: 'من نحن | مركز هوليود سمايل', en: 'About Us | Hollywood Smile Center' },
    '/auth': { ar: 'تسجيل الدخول | مركز هوليود سمايل', en: 'Login | Hollywood Smile Center' },
    '/blog': { ar: 'المدونة | مركز هوليود سمايل', en: 'Blog | Hollywood Smile Center' },
    '/booking': { ar: 'حجز موعد | مركز هوليود سمايل', en: 'Booking | Hollywood Smile Center' },
    '/faq': { ar: 'الأسئلة الشائعة | مركز هوليود سمايل', en: 'FAQ | Hollywood Smile Center' },
    '/contact-us': { ar: 'اتصل بنا | مركز هوليود سمايل', en: 'Contact Us | Hollywood Smile Center' },
    '/doctors': { ar: 'الأطباء | مركز هوليود سمايل', en: 'Doctors | Hollywood Smile Center' },
    '/profile': { ar: 'الملف الشخصي | مركز هوليود سمايل', en: 'Profile | Hollywood Smile Center' },
    '/gallery': { ar: 'المعرض | مركز هوليود سمايل', en: 'Gallery | Hollywood Smile Center' },
    '/services': { ar: 'الخدمات | مركز هوليود سمايل', en: 'Services | Hollywood Smile Center' },
    '/view-profile': { ar: 'عرض الملف الشخصي | مركز هوليود سمايل', en: 'View Profile | Hollywood Smile Center' },
    '/client-bookings': { ar: 'حجوزات العملاء | مركز هوليود سمايل', en: 'Client Bookings | Hollywood Smile Center' },
    '/before-after': { ar: 'قبل وبعد | مركز هوليود سمايل', en: 'Before & After | Hollywood Smile Center' },
    '/rate-doctor': { ar: 'تقييم الدكتور | مركز هوليود سمايل', en: 'Rate Doctor | Hollywood Smile Center' },
    '/not-found': { ar: 'الصفحة غير موجودة | مركز هوليود سمايل', en: 'Page Not Found | Hollywood Smile Center' },
    '/unauthorized': { ar: 'غير مصرح لك | مركز هوليود سمايل', en: 'Unauthorized | Hollywood Smile Center' },
    '/server-error': { ar: 'خطأ في الخادم | مركز هوليود سمايل', en: 'Server Error | Hollywood Smile Center' },
    '/admin-dashboard': { ar: 'لوحة التحكم | مركز هوليود سمايل', en: 'Dashboard | Hollywood Smile Center' },
    '/blog-dashboard': { ar: 'لوحة التحكم | مركز هوليود سمايل', en: 'Blog Dashboard | Hollywood Smile Center' },
    '/support-dashboard': { ar: 'لوحة التحكم | مركز هوليود سمايل', en: 'Support Dashboard | Hollywood Smile Center' },
  }), []);

  useEffect(() => {
    // Get the language from localStorage or set it to Arabic ('ar') if not found
    const lang = localStorage.getItem('language') || 'ar';
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);

    // Set the document direction based on the language
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [i18n]);

  // Set the page title based on the current location
  useEffect(() => {
    const path = location.pathname;
    if (pagesTitles[path]) {
      document.title = pagesTitles[path][i18n.language];
    }
  }, [i18n.language, location, pagesTitles]);


  // Scroll to the top when the location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const App = () => {
  const { clinicInfo } = useClinicContext();
  const isLoading = !clinicInfo;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <ErrorBoundary>
        <ScrollToTop />
        <OfferPopup />
        <Box
          component="main"
          sx={{ overflowX: 'hidden' }}
        >
          <Routes>
            <Route path="/" element={<Suspense fallback={<LoadingSpinner />}><HomePage /></Suspense>} />
            <Route path="/admin-dashboard/*" element={
              <PrivateRoute element={<Suspense fallback={<LoadingSpinner />}><DashboardPage /></Suspense>} requiredRoles={['admin']} />
            } />
            <Route path="/blog-dashboard/*" element={
              <PrivateRoute element={<Suspense fallback={<LoadingSpinner />}><BlogDashboard /></Suspense>} requiredRoles={['admin', 'editor', 'author']} />
            } />
            <Route path="/support-dashboard" element={
              <PrivateRoute element={<Suspense fallback={<LoadingSpinner />}><SupportDashboard /></Suspense>} requiredRoles={['admin', 'support']} />
            } />
            <Route path="/profile" element={
              <PrivateRoute element={<Suspense fallback={<LoadingSpinner />}><ProfilePage /></Suspense>} requiredRoles={['visitor', 'admin', 'support', 'editor', 'author']} />
            } />
            <Route path="/detect-booking" element={
              <PrivateRoute element={<Suspense fallback={<LoadingSpinner />}><ClientBookings /></Suspense>} requiredRoles={['visitor', 'admin', 'support', 'editor', 'author']} />
            } />
            <Route path="/about-us" element={<Suspense fallback={<LoadingSpinner />}><AboutUsPage /></Suspense>} />
            <Route path="/auth/*" element={<Suspense fallback={<LoadingSpinner />}><AuthPage /></Suspense>} />
            <Route path="/blog" element={<Suspense fallback={<LoadingSpinner />}><BlogPage /></Suspense>} />
            <Route path="/blog/:id" element={<Suspense fallback={<LoadingSpinner />}><BlogPostPage /></Suspense>} />
            <Route path="/booking" element={<Suspense fallback={<LoadingSpinner />}><BookingServicePage /></Suspense>} />
            <Route path="/booking/:id" element={<Suspense fallback={<LoadingSpinner />}><BookingPage /></Suspense>} />
            <Route path="/faq" element={<Suspense fallback={<LoadingSpinner />}><FaqPage /></Suspense>} />
            <Route path="/contact-us" element={<Suspense fallback={<LoadingSpinner />}><ContactUsPage /></Suspense>} />
            <Route path="/doctors" element={<Suspense fallback={<LoadingSpinner />}><DoctorsPage /></Suspense>} />
            <Route path="/before-after" element={<Suspense fallback={<LoadingSpinner />}><BeforeAfterPage /></Suspense>} />
            <Route path="/doctors/:id" element={<Suspense fallback={<LoadingSpinner />}><ViewProfile /></Suspense>} />
            <Route path="/rate-doctor/:id" element={<Suspense fallback={<LoadingSpinner />}><RateDoctorPage /></Suspense>} />
            <Route path="/gallery" element={<Suspense fallback={<LoadingSpinner />}><GalleryPage /></Suspense>} />
            <Route path="/gallery/:id" element={<Suspense fallback={<LoadingSpinner />}><ImageDetailsPage /></Suspense>} />
            <Route path="/services" element={<Suspense fallback={<LoadingSpinner />}><ServicesPage /></Suspense>} />
            <Route path="/not-found" element={<Suspense fallback={<LoadingSpinner />}><NotFoundPage /></Suspense>} />
            <Route path="/unauthorized" element={<Suspense fallback={<LoadingSpinner />}><Error403Page /></Suspense>} />
            <Route path="/server-error" element={<Suspense fallback={<LoadingSpinner />}><Error500Page /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<LoadingSpinner />}><Error404Page /></Suspense>} />
          </Routes>
        </Box>
      </ErrorBoundary>
    </Router>
  );
};

export default App;