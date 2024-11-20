// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CustomThemeProvider } from './contexts/ThemeProvider';
import { ClinicProvider } from './contexts/ClinicContext';
import SnackbarProvider from './contexts/SnackbarProvider';
import AuthProvider from './contexts/AuthContext';
import { CssBaseline } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CustomThemeProvider>
        <ClinicProvider>
          <SnackbarProvider>
            <CssBaseline />
            <App />
          </SnackbarProvider>
        </ClinicProvider>
      </CustomThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

