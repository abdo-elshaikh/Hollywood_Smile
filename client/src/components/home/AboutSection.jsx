import { motion } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Button,
    Divider,
    ListItemIcon,
} from '@mui/material';
import { Call, AccessTime, LooksOne, LooksTwo, Looks3, Looks4 } from '@mui/icons-material';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from '../../contexts/ClinicContext';

const AboutSection = () => {
    const { mode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const isDark = mode === 'dark';
    const { clinicInfo } = useClinicContext();

    const content = isArabic
        ? {
            title: 'من نحن',
            description:
                'في مركز هوليوود سمايل، نجمع بين الخبرة والابتكار والرعاية لنمنحك ابتسامة متألقة. رحلتك إلى الابتسامة المثالية تبدأ هنا.',
            whyChooseUs: 'لماذا تختارنا؟',
            chooseUsDetails: [
                { title: 'خبرة واسعة', description: 'نحن نمتلك خبرة واسعة في مجالاتنا ونعمل بجد لتقديم أفضل الخدمات لمرضانا.' },
                { title: 'فريق طبي متخصص', description: 'نحن نعمل كفريق واحد متكامل لتقديم الرعاية الصحية الأمثل لمرضانا.' },
                { title: 'تقنيات حديثة', description: 'نحن نستخدم أحدث التقنيات والأجهزة لتشخيص وعلاج مرضانا بشكل أفضل.' },
                { title: 'خدمة مميزة', description: 'نحن نقدم خدمة مميزة لمرضانا من خلال فريق عمل متفاني ومتخصص.' },
            ],
        }
        : {
            title: 'About Us',
            description:
                'At Hollywood Smile Center, we combine expertise, innovation, and compassion to give you a smile that truly shines. Your journey to a radiant smile begins here.',
            whyChooseUs: 'Why Choose Us?',
            chooseUsDetails: [
                { title: 'Wide Experience', description: 'We have wide experience in our fields and work hard to provide the best services to our patients.' },
                { title: 'Specialized Medical Team', description: 'We work as one integrated team to provide the optimal healthcare to our patients.' },
                { title: 'Modern Technologies', description: 'We use the latest technologies and devices to diagnose and treat our patients better.' },
                { title: 'Special Service', description: 'We provide a special service to our patients through a dedicated and specialized team.' },
            ],
        };

    return (
        <>
            <Box
                sx={{
                    // borderRadius: 4,
                    boxShadow: 0,
                    p: 4,
                    background: isDark
                        ? 'linear-gradient(to top,rgb(124, 124, 124),rgb(99, 99, 99), #424242)'
                        : 'linear-gradient(to top,rgb(224, 240, 253),rgb(215, 239, 251),rgb(182, 219, 249))',
                    borderColor: 'divider',
                    textAlign: 'center',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <Typography
                        variant="h3"
                        color='primary.main'
                        fontWeight="bold"
                        mb={2}
                        textShadow={4}

                    >
                        {t('appointmentSection.emergency.title')}
                    </Typography>
                    <Divider sx={{ mb: 2, width: '50%', mx: 'auto' }} />
                    <Typography variant="h6" color="text.secondary" mb={2} px={2}>
                        {t('appointmentSection.emergency.description')}
                    </Typography>
                    <Button
                        variant="contained"
                        // startIcon={<Call sx={{ mx: 2 }} />}
                        href={`tel:${clinicInfo?.phone}`}
                        sx={{
                            mt: 2,
                            px: 4,
                            py: 1,
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                backgroundColor: mode === 'light' ? 'primary.dark' : 'primary.light',
                                color: 'white',
                                transform: 'scale(1.05)',
                                transition: 'all 0.3s ease-in-out',
                            },
                        }}
                    >
                        <strong>{t('appointmentSection.emergency.call')}</strong> {clinicInfo?.phone}
                    </Button>
                </motion.div>
            </Box>
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={2} minHeight={500}>
                    {/* Why Choose Us Section */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            height: '600px',
                            boxShadow: 3,
                            borderRadius: '0 8px 8px 0',
                            p: 1,
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
                            <Typography align="center" color="primary.main" variant="h4" fontWeight="bold" mb={2}>
                                {content.whyChooseUs}
                            </Typography>
                            <Divider sx={{ mb: 1.5, width: '50%', mx: 'auto', borderColor: 'primary.light' }} />
                            <List>
                                {content.chooseUsDetails.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        disableGutters
                                        sx={{
                                            alignItems: 'center',
                                            mb: 2,
                                            '&:hover': { backgroundColor: 'action.hover', borderRadius: 1 },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 55,
                                                color: 'primary.main',
                                                display: 'flex',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {[<LooksOne sx={{ fontSize: 40 }} />, <LooksTwo sx={{ fontSize: 40 }} />, <Looks3 sx={{ fontSize: 40 }} />, <Looks4 sx={{ fontSize: 40 }} />][index]}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography align={isArabic ? 'right' : 'left'} variant="h6" fontWeight="bold" color="text.primary">
                                                    {item.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography align={isArabic ? 'right' : 'left'} variant="body2" color="text.secondary">
                                                    {item.description}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </motion.div>
                    </Grid>

                    {/* Open Hours Section */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            height: '600px',
                            boxShadow: 3,
                            borderRadius: '8px 0 0 8px',
                            p: 1,
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
                            <Typography align="center" color="primary.main" variant="h4" fontWeight="bold" mb={2}>
                                {t('appointmentSection.openHours.title')} :
                            </Typography>
                            <Divider sx={{ mb: 1.5, width: '50%', mx: 'auto', borderColor: 'primary.light' }} />
                            <List>
                                {Object.keys(clinicInfo?.openHours).map((day, index) => (
                                    <ListItem
                                        key={index}
                                        disableGutters
                                        sx={{
                                            alignItems: 'center',
                                            '&:hover': { backgroundColor: 'action.hover', borderRadius: 1 },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 55,
                                                color: 'primary.main',
                                                display: 'flex',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <AccessTime />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Grid container spacing={0}>
                                                    <Grid item xs={4}>
                                                        <Typography
                                                            align={isArabic ? 'right' : 'left'}
                                                            variant="h6"
                                                            fontWeight="bold"
                                                            color="text.primary"
                                                            fontSize={{
                                                                xs: '1rem',
                                                                sm: '1.2rem',
                                                                md: '1.4rem',
                                                            }}
                                                        >
                                                            {t(`days.${day}`)}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {!clinicInfo?.openHours[day]?.isClosed ? (
                                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                                                    <span>{t('days.from')}</span>{' '}
                                                                    {clinicInfo?.openHours[day]?.from.toLowerCase().replace(/am|pm/g, (e) =>
                                                                        t(`days.${e}`)
                                                                    )}{' '}
                                                                </Typography>
                                                                {' - '}
                                                                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                                                    <span>{t('days.to')}</span>{' '}
                                                                    {clinicInfo?.openHours[day]?.to.toLowerCase().replace(/am|pm/g, (e) =>
                                                                        t(`days.${e}`)
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            <Typography fontWeight='bold' align={isArabic ? 'right' : 'left'} variant="body1" sx={{ color: 'text.primary' }}>
                                                                {t('days.closed')}
                                                            </Typography>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </motion.div>
                    </Grid>
                </Grid>

            </Container >
        </>
    );
};

export default AboutSection;
