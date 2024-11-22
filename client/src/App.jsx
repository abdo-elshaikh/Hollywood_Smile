// src/App.jsx
import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import DashboardPage from './pages/DashboardPage';
import BlogDashboard from './pages/BlogDashboard';
import BlogPage from './pages/BlogPage';
import BookingPage from './pages/BookingPage';
import FaqPage from './pages/FaqPage';
import ContactUsPage from './pages/ContactUsPage';
import DoctorsPage from './pages/DoctorsPage';
import GalleryPage from './pages/GalleryPage';
import ImageDetailsPage from './pages/ImageDetailsPage';
import ServicesPage from './pages/ServicesPage';
import ViewProfile from './pages/ViewProfile';
import ClientBookings from './pages/ClientBookings';
import Error404Page from './pages/404Page';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import Error403Page from './pages/403Page';
import Error500Page from './pages/500Page';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/index.css';
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
    '/gallery': { ar: 'المعرض | مركز هوليود سمايل', en: 'Gallery | Hollywood Smile Center' },
    '/services': { ar: 'الخدمات | مركز هوليود سمايل', en: 'Services | Hollywood Smile Center' },
    '/not-found': { ar: 'الصفحة غير موجودة | مركز هوليود سمايل', en: 'Page Not Found | Hollywood Smile Center' },
    '/unauthorized': { ar: 'غير مصرح لك | مركز هوليود سمايل', en: 'Unauthorized | Hollywood Smile Center' },
    '/server-error': { ar: 'خطأ في الخادم | مركز هوليود سمايل', en: 'Server Error | Hollywood Smile Center' },
    '/dashboard': { ar: 'لوحة التحكم | مركز هوليود سمايل', en: 'Dashboard | Hollywood Smile Center' },
    '/blog-dashboard': { ar: 'لوحة التحكم | مركز هوليود سمايل', en: 'Blog Dashboard | Hollywood Smile Center' },
  }), []);

  // Effect to update document title and direction based on current location and language
  useEffect(() => {
    const path = location.pathname;
    if (pagesTitles[path]) {
      document.title = pagesTitles[path][i18n.language];
    }

    // Set the document direction based on the language
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language, location, pagesTitles]);

  // Scroll to the top when the location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return null;
};

const App = () => {
  const { user } = useAuth();
  const isLoading = user === null;

  // if (isLoading) {
  //   return <LoadingSpinner />;
  // }


  useEffect(() => {
    document.title = 'Hollywood Smile Center';
  }, []);

  return (
    <main>
      <Router>
        <ScrollToTop />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard/*" element={
              <PrivateRoute element={<DashboardPage />} requiredRoles={['admin']} />
            } />
            <Route path="/blog-dashboard/*" element={
              <PrivateRoute element={<BlogDashboard />} requiredRoles={['admin', 'editor', 'author']} />
            } />
            <Route path="/detect-booking" element={
              <PrivateRoute element={<ClientBookings />} requiredRoles={['visitor']} />
            } />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/blog/*" element={<BlogPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/:id" element={<ImageDetailsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/doctors/:id" element={<ViewProfile />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="/unauthorized" element={<Error403Page />} />
            <Route path="/server-error" element={<Error500Page />} />
            <Route path="*" element={<Error404Page />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </main>
  );
};

export default App;
