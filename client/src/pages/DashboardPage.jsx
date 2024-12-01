import React, { useState, useEffect } from "react";
import { Box, CssBaseline, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";
import SubHeader from "../components/dashboard/SubHeader";
import MainContentPage from "../components/dashboard/MainContentPage";
import ManageUsersPage from "../components/dashboard/ManageUsersPage";
import ManageBookingsPage from "../components/dashboard/ManageBookingsPage";
import ManageOffers from "../components/dashboard/ManageOffers";
import ManageFilesPage from "../components/dashboard/ManageFilesPage";
import ManageServicesPage from "../components/dashboard/ManageServicesPage";
import ManageDoctors from "../components/dashboard/ManageDoctors";
import ManageClinicInfoPage from "../components/dashboard/ManageClinicInfoPage";
import TestimonialsManager from "../components/dashboard/TestimonialsManager";
import CustomizationPanel from "../components/dashboard/CustomizationPanel";
import ManageFAQPage from "../components/dashboard/ManageFAQPage";
import ManageMessagesPage from "../components/dashboard/ManageMessagesPage";
import ManageSubscriptionsPage from "../components/dashboard/ManageSubscriptionsPage";
import ManageNotificationsPage from "../components/dashboard/NotificationsPage";
import ManageGalleryPage from "../components/dashboard/ManageGalleryPage";
import ManageBeforeAfter from '../components/dashboard/ManageBeforeAfter';


const DashboardPage = () => {
    document.body.dir = 'ltr';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [open, setOpen] = useState(!isMobile);
    const [sidebarWidth, setSidebarWidth] = useState(isMobile ? 60 : 240);
    const [currentPage, setCurrentPage] = useState('home');

    const handleDrawerToggle = () => {
        setOpen(!open);
        setSidebarWidth(open ? 60 : 240);
    };

    useEffect(() => {
        setSidebarWidth(open ? 240 : 60);
    }, [open]);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Dashboard | ${currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace('-', ' ')}`;
    }, [currentPage]);

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                background: theme.palette.background.default,
                transition: "background-color 0.3s ease",
            }}
        >
            <CssBaseline />
            <Header onToggleDrawer={handleDrawerToggle} sidebarWidth={sidebarWidth} />
            <Sidebar
                open={open}
                onToggleDrawer={handleDrawerToggle}
                sidebarWidth={sidebarWidth}
                setCurrentPage={setCurrentPage}
                isMobile={isMobile}
                setOpen={setOpen}
            />

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    px: 3,
                    py: 2,
                    transition: "margin-left 0.3s ease, width 0.3s ease",
                    overflowY: "auto",
                    minHeight: "100vh",
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: theme.shadows[3],
                }}
            >
                <Toolbar />

                {/* Sub Header */}
                <SubHeader currentPage={currentPage} />

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    flexGrow={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Routes>
                        <Route path="/" element={<MainContentPage />} />
                        <Route path="/users" element={<ManageUsersPage />} />
                        <Route path="/online-bookings" element={<ManageBookingsPage />} />
                        <Route path="/offers" element={<ManageOffers />} />
                        <Route path="/services" element={<ManageServicesPage />} />
                        <Route path="/files" element={<ManageFilesPage />} />
                        <Route path="/doctors" element={<ManageDoctors />} />
                        <Route path="/faqs" element={<ManageFAQPage />} />
                        <Route path="/clinic-info" element={<ManageClinicInfoPage />} />
                        <Route path="/testimonials" element={<TestimonialsManager />} />
                        <Route path="/gallery" element={<ManageGalleryPage />} />
                        <Route path="/before-after" element={<ManageBeforeAfter />} />
                        <Route path="/subscriptions" element={<ManageSubscriptionsPage />} />
                        <Route path="/messages" element={<ManageMessagesPage setCurrentPage={setCurrentPage} />} />
                        <Route path="/notifications" element={<ManageNotificationsPage setCurrentPage={setCurrentPage} />} />
                        <Route path="/settings/customization" element={<CustomizationPanel />} />
                    </Routes>
                </motion.div>
            </Box>
        </Box>
    );
};

export default DashboardPage;
