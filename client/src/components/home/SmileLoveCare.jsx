import React from 'react';
import { Box, Typography, Grid, Container, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SquareIcon from '@mui/icons-material/Square';
import CircleIcon from '@mui/icons-material/Circle';
import FavoriteIcon from '@mui/icons-material/Favorite';

const SmileLoveCare = () => {
    const { t } = useTranslation();

    return (
        <Box
            component="section"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 6,
                py: 8,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Icons for Aesthetic Enhancement */}
            <motion.div
                initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 45 }}
                transition={{ duration: 1.5 }}
                style={{ position: 'absolute', bottom: 0, right: 0, zIndex: -1 }}
            >
                <SquareIcon sx={{ fontSize: 500, color: '#f07167', opacity: 0.1 }} />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: -45 }}
                transition={{ duration: 1.5 }}
                style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
            >
                <SquareIcon sx={{ fontSize: 500, color: '#f07167', opacity: 0.1 }} />
            </motion.div>

            {/* SMILE, LOVE, CARE Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Grid
                    container
                    spacing={3}
                    sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {['smile', 'love', 'care'].map((text, index) => (
                        <React.Fragment key={text}>
                            <Grid item>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h2" sx={{ fontWeight: 600, color: '#f07167', ml: 1, fontFamily: 'Poppins' }}>
                                        {t(`SmileLoveCare.${text}`)}
                                    </Typography>
                                </Box>
                                
                            </Grid>
                            {
                                index < 2 && (
                                    <Grid item>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                duration: 1.5,
                                                delay: index * 0.3,
                                                repeat: Infinity,
                                                repeatType: 'reverse',
                                            }}
                                        >
                                            <FavoriteIcon sx={{ fontSize: 40, color: 'red', opacity: 0.6 }} />
                                        </motion.div>
                                    </Grid>
                                )
                            }
                        </React.Fragment>
                    ))}
                </Grid>
            </motion.div>

            {/* Section Description */}
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    maxWidth: 'md',
                    mt: 2,
                    mx: 'auto',
                    color: 'text.secondary',
                }}
            >
                {t('SmileLoveCare.description')}
            </Typography>

            {/* Information Cards for Each Topic */}
            <Container maxWidth="lg">
                <Grid container spacing={3} justifyContent="center" mt={4}>
                    {['smile', 'love', 'care'].map((text) => (
                        <Grid item xs={12} sm={6} md={4} key={text}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.7 + 0.3 * (text === 'smile' ? 0 : text === 'love' ? 1 : 2),
                                }}
                            >
                                <Card
                                    sx={{
                                        minHeight: 200,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        p: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': { transform: 'translateY(-10px)', boxShadow: '0px 8px 16px rgba(0,0,0,0.2)' },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f07167' }}>
                                            {t(`SmileLoveCare.${text}Title`)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" mt={1}>
                                            {t(`SmileLoveCare.${text}Description`)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Call to Action Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                style={{ marginTop: '2rem' }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1rem', md: '1.2rem' },
                        color: 'text.primary',
                    }}
                >
                    {t('SmileLoveCare.callToAction')}
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        mt: 2,
                        px: 4,
                        py: 1.5,
                        bgcolor: '#f07167',
                        color: '#ffffff',
                        '&:hover': { bgcolor: '#e35b56' },
                    }}
                    href="/booking"
                >
                    {t('SmileLoveCare.contactUs')}
                </Button>
            </motion.div>
        </Box >
    );
};

export default SmileLoveCare;
