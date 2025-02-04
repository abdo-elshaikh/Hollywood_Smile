import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import Confetti from 'react-confetti';

const SuccessMessage = ({ name, phone, date, time }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    const [seconds, setSeconds] = useState(20);
    const [showConfetti, setShowConfetti] = useState(true);

    // Timer countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds === 0) {
                    clearInterval(interval);
                    setShowConfetti(false);
                    navigate('/'); // Redirect to home or another route after countdown
                    return 0;
                }
                return prevSeconds - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    // Format countdown to show minutes:seconds
    const formattedCountdown = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

    // Animation variants for Framer Motion
    const iconAnimation = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.6, ease: 'easeOut' },
    };

    const textAnimation = (delay) => ({
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { delay, duration: 0.6, ease: 'easeOut' },
    });

    return (
        <>
            {/* Confetti Animation */}
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={1000}
                    onConfettiComplete={() => setShowConfetti(false)}
                />
            )}

            {/* Main Content Container */}
            <Box
                textAlign="center"
                sx={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    padding: theme.spacing(4),
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[3],
                }}
                aria-live="polite"
                aria-atomic="true"
            >
                {/* Success Icon Animation */}
                <motion.div {...iconAnimation}>
                    <CheckCircle
                        sx={{
                            color: 'success.main',
                            fontSize: '4rem',
                            mb: 3,
                        }}
                        aria-hidden="true"
                    />
                </motion.div>

                {/* Title Animation */}
                <motion.div {...textAnimation(0.2)}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            color: theme.palette.text.primary,
                        }}
                    >
                        {t('appointmentSection.success.title', { name })}
                    </Typography>
                </motion.div>

                {/* Description Animation */}
                <motion.div {...textAnimation(0.4)}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.palette.text.secondary,
                            mb: 3,
                        }}
                    >
                        {t('appointmentSection.success.description', { date, time })}
                    </Typography>
                </motion.div>

                {/* Contact Information Animation */}
                <motion.div {...textAnimation(0.6)}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 'bold',
                            mb: 3,
                        }}
                    >
                        {t('appointmentSection.success.contact', { phone })}
                    </Typography>
                </motion.div>

                <Divider sx={{ my: 4 }} />

                {/* Countdown Animation */}
                <motion.div {...textAnimation(0.8)}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.palette.text.secondary,
                        }}
                    >
                        {t('appointmentSection.success.countdown', { seconds: formattedCountdown })}
                    </Typography>
                </motion.div>
            </Box>
        </>
    );
};

export default SuccessMessage;