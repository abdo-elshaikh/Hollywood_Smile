// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CustomThemeProvider } from './contexts/ThemeProvider';
import { ClinicProvider } from './contexts/ClinicContext';
import SnackbarProvider from './contexts/SnackbarProvider';
import AuthProvider from './contexts/AuthContext';
import { CssBaseline } from '@mui/material';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';

import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CustomThemeProvider>
        <ClinicProvider>
          <SnackbarProvider>
            <Analytics />
            <SpeedInsights />
            <CssBaseline />
            <App />
          </SnackbarProvider>
        </ClinicProvider>
      </CustomThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

