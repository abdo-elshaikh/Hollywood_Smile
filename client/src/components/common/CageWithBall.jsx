import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CageWithBall = () => {
  const [ballPosition, setBallPosition] = useState({
    top: 0,
    left: 0,
    stepX: 0,  // Horizontal step for the ball
    stepY: 0,  // Vertical step for the ball
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setBallPosition((prevPosition) => {
        // Generate random step between -5 and +5 for both X and Y axes
        const randomStepX = Math.random() * 100 - 50; // Random step between -5 and +5 for X
        const randomStepY = Math.random() * 100 - 50; // Random step between -5 and +5 for Y

        let newTop = prevPosition.top + randomStepY;  // Update vertical position
        let newLeft = prevPosition.left + randomStepX;  // Update horizontal position

        // Ensure the ball doesn't go outside the viewport boundaries (viewport width/height)
        if (newTop < 0) newTop = 0;
        if (newTop > window.innerHeight - 50) newTop = window.innerHeight - 50;
        if (newLeft < 0) newLeft = 0;
        if (newLeft > window.innerWidth - 50) newLeft = window.innerWidth - 50;

        return { top: newTop, left: newLeft, stepX: randomStepX, stepY: randomStepY };
      });
    }, 50); // Update every 50ms for smooth movement (~20fps)

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div style={styles.pageContainer}>
      <motion.div
        style={{
          ...styles.ball,
          top: `${ballPosition.top}px`,
          left: `${ballPosition.left}px`,

        }}
      />
    </div>
  );
};

const styles = {
  pageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',  // Full height of the viewport
    backgroundColor: '#f0f0f0',  // Background color of the page
    overflow: 'hidden',  // Hide any content going outside the viewport
  },
  ball: {
    position: 'absolute',
    width: '50px',     // Size of the ball
    height: '50px',
    borderRadius: '50%',
    backgroundColor: 'blue',  // Ball color
  },
};

export default CageWithBall;
