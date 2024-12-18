import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemIcon,
    Card,
    CardContent,
    CardActions,
    Button,
} from '@mui/material';
import { AccessTime, LooksOne, LooksTwo, Looks3, Looks4 } from '@mui/icons-material';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from '../../contexts/ClinicContext';
import { motion } from 'framer-motion';

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
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}

        >
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={4} justifyContent="center">
                    {/* Left Column (Why Choose Us Section) */}
                    <Grid item xs={12} md={6}>
                        <Box
                            elevation={3}
                            sx={{
                                padding: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                // alignItems: 'center',
                                height: '100%',
                            }}
                        >
                            <Typography align={isArabic ? 'right' : 'left'} variant="h4" fontWeight="bold" color="primary.main" mb={2}>
                                {content.whyChooseUs}
                            </Typography>
                            <Divider sx={{ mb: 2, width: '50%', mx: 0, borderColor: 'primary.light' }} />
                            <List>
                                {content.chooseUsDetails.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                    >
                                        <ListItem
                                            key={index}
                                            sx={{
                                                alignItems: 'center',
                                                borderBottom: '1px solid',
                                                '&:hover': {
                                                    backgroundColor: 'action.hover',
                                                    borderRadius: 1,
                                                },
                                                mb: 2,
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 50, color: 'primary.main' }}>
                                                {[<LooksOne fontSize="large" />, <LooksTwo fontSize="large" />, <Looks3 fontSize="large" />, <Looks4 fontSize="large" />][index]}
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
                                                primaryTypographyProps={{ variant: 'h6', fontWeight: 'bold', color: 'text.primary' }}
                                                secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            />
                                        </ListItem>
                                    </motion.div>
                                ))}
                            </List>
                            <Button
                                variant="text"
                                color="primary"
                                text="primary"
                                sx={{ mt: 2, px: 4, py: 1, alignSelf: 'start' }}
                            >
                                {isArabic ? 'اقرأ المزيد' : 'Read More'}
                            </Button>
                        </Box>
                    </Grid>

                    {/* Right Column (Open Hours Section) */}
                    <Grid item xs={12} md={6}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            px: { xs: 0, md: 2 },
                        }}
                    >
                        <Card
                            elevation={3}
                            sx={{
                                borderRadius: 2,
                                boxShadow: 4,
                                backgroundColor: isDark ? "#333" : "#E3F2FD",
                                py: 3,
                                px: { xs: 0, md: 2 },
                                display: 'flex',
                                flexDirection: 'column',
                                // alignItems: 'center',
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Typography align="center" variant="h4" fontWeight="bold" color="primary.main" mb={2}>
                                    {t('appointmentSection.openHours.title')}
                                </Typography>
                                <Divider sx={{ mb: 2, width: '50%', mx: 'auto', borderColor: 'primary.light' }} />
                                <List>
                                    {Object.keys(clinicInfo?.openHours).map((day, index) => (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                alignItems: 'center',
                                                width: '100%',
                                                '&:hover': {
                                                    backgroundColor: 'action.hover',
                                                    borderRadius: 1,
                                                },
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                                                <AccessTime />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Typography
                                                            variant="h6"
                                                            color="text.primary"
                                                            sx={{
                                                                textTransform: 'capitalize',
                                                                textAlign: isArabic ? 'right' : 'left',
                                                                fontWeight: 'bold',
                                                                fontSize: { xs: '1rem', sm: '1.2rem' },
                                                            }}
                                                        >
                                                            {t(`days.${day}`)} :
                                                        </Typography>
                                                        {clinicInfo?.openHours[day]?.isClosed ? (
                                                            <Typography
                                                                color="text.secondary"
                                                                fontWeight="bold"
                                                                sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
                                                            >
                                                                {t('days.closed')}
                                                            </Typography>
                                                        ) : (
                                                            <Typography
                                                                color="text.primary"
                                                                textDecoration="underline"
                                                                sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
                                                            >
                                                                {t('days.from')} {clinicInfo?.openHours[day]?.from.toLowerCase().replace(/am|pm/g, (match) => t(`days.${match}`))} - {t('days.to')} {clinicInfo?.openHours[day]?.to.toLowerCase().replace(/am|pm/g, (match) => t(`days.${match}`))}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AboutSection;
