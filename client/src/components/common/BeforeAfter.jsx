import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowForward, ArrowBack } from '@mui/icons-material'; // Material-UI icons

const BeforeAfter = ({
    beforeImage,
    afterImage,
    className = 'before-after-slider',
    beforeClassName = 'before',
    afterClassName = 'after',
    buttonClassName = 'resize-button',
    style,
    beforeStyle,
    afterStyle,
    buttonStyle,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [rangeValue, setRangeValue] = useState(50); // Initial value for the slider (50% split)
    const sliderRef = useRef(null);

    // Handle the mouse down event (start dragging)
    const handleMouseDown = (e) => {
        setIsDragging(true);
        e.preventDefault(); // Prevent text selection
    };

    // Handle the mouse move event (update slider position while dragging)
    const handleMouseMove = (e) => {
        if (isDragging) {
            const { left, width } = sliderRef.current.getBoundingClientRect();
            const positionX = e.clientX - left;
            const percentage = (positionX / width) * 100;
            setRangeValue(Math.min(Math.max(percentage, 0), 100));
        }
    };

    // Handle the mouse up event (stop dragging)
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Prevent dragging outside the container by adding mousemove and mouseup to document
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <Box
            ref={sliderRef}
            className={className}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                height: 'auto',
                cursor: 'ew-resize',
                ...style,
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Before Image */}
            <motion.div
                className={beforeClassName}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${rangeValue}%`,
                    height: '100%',
                    overflow: 'hidden',
                    ...beforeStyle,
                }}
                animate={{
                    width: `${rangeValue}%`,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <img
                    src={beforeImage}
                    alt="Before"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                />
            </motion.div>

            {/* After Image */}
            <motion.div
                className={afterClassName}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: `${rangeValue}%`,
                    width: `${100 - rangeValue}%`,
                    height: '100%',
                    overflow: 'hidden',
                    ...afterStyle,
                }}
                animate={{
                    left: `${rangeValue}%`,
                    width: `${100 - rangeValue}%`,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <img
                    src={afterImage}
                    alt="After"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                />
            </motion.div>

            {/* Resize Button */}
            <motion.div
                className={buttonClassName}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${rangeValue}%`,
                    transform: 'translateX(-50%) translateY(-50%)',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    ...buttonStyle,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 100 }}
                dragElastic={0.2}
            >
                <IconButton size="small">
                    <ArrowForward />
                </IconButton>
                <IconButton size="small">
                    <ArrowBack />
                </IconButton>
            </motion.div>
        </Box>
    );
};

export default BeforeAfter;
