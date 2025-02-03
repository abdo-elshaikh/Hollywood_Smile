import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Slide, Fade, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import axiosInstance from '../../services/axiosInstance';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PopupContainer = styled(Box)(({ theme }) => ({
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 320,
    maxWidth: '90%',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1100,
}));

const OfferPopup = () => {
    const [open, setOpen] = useState(false);
    const [fade, setFade] = useState(false);
    const [offers, setOffers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { t, i18n } = useTranslation();
    const EN = i18n.language === 'en';
    const navigate = useNavigate();


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

    const handleClaimOffer = (offerId) => {
        handleClose();
        navigate(`/booking/${offerId}`);
    };

    const currentOffer = offers[currentIndex];

    return (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
            <Fade in={fade}>
                <PopupContainer>
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
                                    style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
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
                                    '&:hover': { backgroundColor: '#D81B60' },
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
