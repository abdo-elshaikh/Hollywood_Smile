import React, { useState, useEffect } from 'react';
import { Button, Tooltip, useTheme } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { motion } from 'framer-motion';

const ScrollToTopButton = () => {
    const [show, setShow] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 300); // Show button when scrolling 300px or more
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener when component is unmounted
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Smooth scrolling to top
        });
    };

    return (
        <motion.div
            initial={{ x: 150 }} // Start further off-screen
            animate={{ x: show ? 0 : 150 }} // Slide in and out based on `show`
            transition={{ type: 'spring', stiffness: 500, damping: 30 }} // Spring effect
            style={{
                position: 'fixed',
                bottom: 25,
                right: 0,
                zIndex: 1000,
            }}
        >
            {/* Tooltip added to show a message on hover */}
            <Tooltip title="Scroll to Top" arrow>
                <Button
                    onClick={handleClick}
                    variant="contained"
                    sx={{
                        padding: '12px 25px',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        borderRadius: '12px 0 0 12px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        },
                    }}
                >
                    {/* Animated arrow icon */}
                    <motion.div
                        animate={{
                            y: [0, -5, 0], // Subtle bouncing
                            scale: [1, 1.1, 1], // Pulsing effect
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: 'reverse', // Smooth repeat
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <KeyboardArrowUpIcon
                            sx={{
                                fontSize: 20,
                                transition: 'transform 0.2s ease-in-out',
                            }}
                        />
                    </motion.div>
                </Button>
            </Tooltip>
        </motion.div>
    );
};

export default ScrollToTopButton;
