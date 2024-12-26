import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CustomThemeProvider } from './contexts/ThemeProvider';
import { ClinicProvider } from './contexts/ClinicContext';
import SnackbarProvider from './contexts/SnackbarProvider';
import AuthProvider from './contexts/AuthContext';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-coverflow';
import 'swiper/css/grid';

import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SpeedInsights />
    <Analytics />
    <AuthProvider>
      <CustomThemeProvider>
        <ClinicProvider>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </ClinicProvider>
      </CustomThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
