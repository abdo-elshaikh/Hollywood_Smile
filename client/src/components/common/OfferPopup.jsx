import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Slide, Fade, Divider, useTheme, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import axiosInstance from '../../services/axiosInstance';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PopupContainer = styled(Box)(({ theme, isMobile }) => ({
    position: 'fixed',
    bottom: isMobile ? 10 : 20,
    right: isMobile ? 10 : 20,
    width: isMobile ? 'calc(100% - 100px)' : 300,
    maxWidth: '95%',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1100,
    touchAction: 'pan-y', // Ensure vertical scrolling is not blocked
}));

const OfferPopup = () => {
    const [open, setOpen] = useState(false);
    const [fade, setFade] = useState(false);
    const [offers, setOffers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { t, i18n } = useTranslation();
    const EN = i18n.language === 'en';
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const touchStartX = useRef(null); // Track touch start position

    useEffect(() => {
        fetchOffers();

        // Auto open popup after 5 seconds for the first time
        const showTimer = setTimeout(() => {
            setOpen(true);
            setTimeout(() => setFade(true), 200);
        }, 5000);

        // Set up auto-open every 3 minutes
        const autoOpenTimer = setInterval(() => {
            setOpen(true);
            setTimeout(() => setFade(true), 200);
        }, 180000);

        const closeTimer = setTimeout(() => {
            handleClose();
        }, 30000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(closeTimer);
            clearInterval(autoOpenTimer);
        };
    }, []);

    useEffect(() => {
        if (offers.length > 1) {
            const rotationTimer = setInterval(() => {
                setFade(false);
                setTimeout(() => {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
                    setFade(true);
                }, 500);
            }, 10000);

            return () => clearInterval(rotationTimer);
        }
    }, [offers]);

    const fetchOffers = async () => {
        try {
            const res = await axiosInstance.get('/offers');
            if (res.data.length > 0) {
                setOffers(res.data.filter((offer) => new Date(offer.expiryDate) > Date.now()));
                setCurrentIndex(0);
            }
        } catch (error) {
            console.error('Failed to fetch offers:', error);
        }
    };

    const handleClose = () => {
        setFade(false);
        setTimeout(() => {
            setOpen(false);
        }, 400);
    };

    const handleClaimOffer = (id) => {
        handleClose();
        navigate(`/booking/${id}`);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX; // Record the initial touch position
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;

        const touchEndX = e.changedTouches[0].clientX; // Record the final touch position
        const deltaX = touchEndX - touchStartX.current; // Calculate the horizontal distance

        if (Math.abs(deltaX) > 50) { // Minimum swipe distance threshold
            if (deltaX > 0) {
                // Swipe right: go to the previous offer
                setFade(false);
                setTimeout(() => {
                    setCurrentIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
                    setFade(true);
                }, 200);
            } else {
                // Swipe left: go to the next offer
                setFade(false);
                setTimeout(() => {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
                    setFade(true);
                }, 200);
            }
        }

        touchStartX.current = null; // Reset the touch start position
    };

    const currentOffer = offers[currentIndex];

    return (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
            <Fade in={fade}>
                <PopupContainer
                    isMobile={isMobile}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', top: 5, right: 5 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {currentOffer ? (
                        <>
                            <Typography variant="h6" fontWeight="bold" textAlign="center">
                                {EN ? '🎉 Exclusive Offer!' : 'عرض مميز 🎉 '}
                            </Typography>
                            <Typography variant="body2" textAlign="center" mt={1} fontWeight="bold" color="primary">
                                {EN ? currentOffer.title.en : currentOffer.title.ar}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2" textAlign="center">
                                {EN ? currentOffer.description.en : currentOffer.description.ar}
                            </Typography>
                            <Box mt={2}>
                                <img
                                    src={currentOffer.imageUrl}
                                    alt="Offer"
                                    loading="lazy"
                                    style={{ width: '100%', borderRadius: 8, objectFit: 'cover', objectPosition: 'center' }}
                                />
                            </Box>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    borderRadius: 8,
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    '&:hover': { backgroundColor: 'secondary.main' },
                                }}
                                onClick={() => handleClaimOffer(currentOffer._id)}
                            >
                                {EN ? 'Claim Offer 🎁' : 'أحصل على العرض 🎁'}
                            </Button>
                        </>
                    ) : (
                        <Typography variant="body2" textAlign="center">
                            {EN ? 'No offers available' : 'لا توجد عروض متاحة'}
                        </Typography>
                    )}
                </PopupContainer>
            </Fade>
        </Slide>
    );
};

export default OfferPopup;