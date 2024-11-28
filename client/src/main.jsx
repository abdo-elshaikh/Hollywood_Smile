// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CustomThemeProvider } from './contexts/ThemeProvider';
import { ClinicProvider } from './contexts/ClinicContext';
import SnackbarProvider from './contexts/SnackbarProvider';
import AuthProvider from './contexts/AuthContext';
import { CssBaseline } from '@mui/material';
import { Analytics } from '@vercel/analytics/next';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import 'swiper/css/a11y';

import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CustomThemeProvider>
        <ClinicProvider>
          <SnackbarProvider>
            <Analytics />
            <CssBaseline />
            <App />
          </SnackbarProvider>
        </ClinicProvider>
      </CustomThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

