import React from 'react';
import { Container, Grid, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { motion } from 'framer-motion';

const containerVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.3 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Clinic Information Section Component
const ClinicInformation = () => (
  <Container sx={{ py: 10 }}>
    <Typography
      variant="h3"
      sx={{
        textAlign: 'center',
        mb: 6,
        fontWeight: 'bold',
        color: 'primary.main',
        textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)',
      }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      Clinic Information
    </Typography>
    <Grid
      container
      spacing={6}
      component={motion.div}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariant}
    >
      {/* Address Section */}
      <Grid item xs={12} md={4} component={motion.div} variants={itemVariant}>
        <Box
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-5px)' },
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Address
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            123 Dental St, Smile City, CA 90210
          </Typography>
        </Box>
      </Grid>

      {/* Contact Information Section */}
      <Grid item xs={12} md={4} component={motion.div} variants={itemVariant}>
        <Box
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-5px)' },
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Contact Information
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            Phone: +1 (123) 456-7890
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            Email: info@hollywoodsmileclinic.com
          </Typography>
        </Box>
      </Grid>

      {/* Opening Hours Section */}
      <Grid item xs={12} md={4} component={motion.div} variants={itemVariant}>
        <Box
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-5px)' },
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Opening Hours
          </Typography>
          <List sx={{ py: 0 }}>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemText primary="Mon - Fri: 9 AM - 6 PM" />
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemText primary="Saturday: 10 AM - 4 PM" />
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemText primary="Sunday: Closed" />
            </ListItem>
          </List>
        </Box>
      </Grid>
    </Grid>
  </Container>
);

export default ClinicInformation;
