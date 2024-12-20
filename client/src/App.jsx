import React, { useEffect, useMemo, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from './contexts/ClinicContext';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const AboutUsPage = React.lazy(() => import('./pages/AboutUsPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const SupportDashboard = React.lazy(() => import('./pages/SupportDashboard'));
const BlogDashboard = React.lazy(() => import('./pages/BlogDashboard'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const BookingPage = React.lazy(() => import('./pages/BookingPage'));
const BookingServicePage = React.lazy(() => import('./pages/BookingServicePage'));
const FaqPage = React.lazy(() => import('./pages/FaqPage'));
const ContactUsPage = React.lazy(() => import('./pages/ContactUsPage'));
const DoctorsPage = React.lazy(() => import('./pages/DoctorsPage'));
const GalleryPage = React.lazy(() => import('./pages/GalleryPage'));
const ImageDetailsPage = React.lazy(() => import('./pages/ImageDetailsPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const ViewProfile = React.lazy(() => import('./pages/ViewProfile'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ClientBookings = React.lazy(() => import('./pages/ClientBookings'));
const Error404Page = React.lazy(() => import('./pages/404Page'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const Error403Page = React.lazy(() => import('./pages/403Page'));
const Error500Page = React.lazy(() => import('./pages/500Page'));
const LoadingSpinner = React.lazy(() => import('./components/common/LoadingSpinner'));
const ErrorBoundary = React.lazy(() => import('./components/common/ErrorBoundary'));
const RateDoctorPage = React.lazy(() => import('./pages/RateDoctorPage'));

import PrivateRoute from './components/PrivateRoute';
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
    '/rate-doctor': { ar: 'تقييم الدكتور | مركز هوليود سمايل', en: 'Rate Doctor | Hollywood Smile Center' },
    '/not-found': { ar: 'الصفحة غير موجودة | مركز هوليود سمايل', en: 'Page Not Found | Hollywood Smile Center' },
    '/unauthorized': { ar: 'غير مصرح لك | مركز هوليود سمايل', en: 'Unauthorized | Hollywood Smile Center' },
    '/server-error': { ar: 'خطأ في الخادم | مركز هوليود سمايل', en: 'Server Error | Hollywood Smile Center' },
    '/dashboard': { ar: 'لوحة التحكم | مركز هوليود سمايل', en: 'Dashboard | Hollywood Smile Center' },
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
        <Box
          component="main"
          sx={{ overflowX: 'hidden' }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard/*" element={
              <PrivateRoute element={<DashboardPage />} requiredRoles={['admin']} />
            } />
            <Route path="/blog-dashboard/*" element={
              <PrivateRoute element={<BlogDashboard />} requiredRoles={['admin', 'editor', 'author']} />
            } />
            <Route path="/support-dashboard" element={
              <PrivateRoute element={<SupportDashboard />} requiredRoles={['admin', 'support']} />
            } />
            <Route path="/profile" element={
              <PrivateRoute element={<ProfilePage />} requiredRoles={['visitor', 'admin', 'support', 'editor', 'author']} />
            } />
            <Route path="/detect-booking" element={
              <PrivateRoute element={<ClientBookings />} requiredRoles={['visitor']} />
            } />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/booking" element={<BookingServicePage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/:id" element={<ViewProfile />} />
            <Route path="/rate-doctor/:id" element={<RateDoctorPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/:id" element={<ImageDetailsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="/unauthorized" element={<Error403Page />} />
            <Route path="/server-error" element={<Error500Page />} />
            <Route path="*" element={<Error404Page />} />
          </Routes>
        </Box>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
