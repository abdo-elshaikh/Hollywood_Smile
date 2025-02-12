import React from 'react';
import { Box } from '@mui/material';
import heroVideo from '../../assets/videos/hero-section.mp4';

const VideoBackground = () => {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                zIndex: 1,
            }}
        >
            <Box
                component="video"
                autoPlay
                loop
                muted
                playsInline
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.85)",
                }}
            >
                <source src={heroVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </Box>
        </Box>
    );
};

export default VideoBackground;