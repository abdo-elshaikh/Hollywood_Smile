import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../../contexts/ThemeProvider';

const RandomJumpBall = () => {
    const { mode } = useCustomTheme();
    const [ballPosition, setBallPosition] = useState({
        top: 0,
        left: 0,
    });

    // Function to generate random jump positions
    const getRandomPosition = () => {
        return {
            top: Math.random() * 70 + 10, // random vertical position between 10% and 80%
            left: Math.random() * 90 + 5, // random horizontal position between 5% and 95%
        };
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setBallPosition(getRandomPosition());
        }, 1000); // Change position every second

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    const styles = {
        backgroundContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        ball: {
            position: 'absolute',
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: '#ff6f61',
        },
    };

    return (
        <div style={styles.backgroundContainer}>
            <motion.div
                style={{
                    ...styles.ball,
                    top: `${ballPosition.top}%`,
                    left: `${ballPosition.left}%`,
                }}
                animate={{
                    y: ['0%', '20%', '0%'], // Random jump animation
                }}
                transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                    repeat: Infinity, // Infinite jump loop
                    repeatType: 'loop',
                }}
            />
        </div>
    );
};

export default RandomJumpBall;
