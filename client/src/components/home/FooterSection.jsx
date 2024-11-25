import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    Divider,
    Button,
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    CalendarToday,
    Person,
    Chat,
    Phone,
    Email,
    Map as MapIcon,
} from '@mui/icons-material';

const FooterSection = () => {
    return (
        <Box component="footer" sx={{ bgcolor: 'background.default', color: 'text.primary', py: 5 }}>
            <Container>
                <Grid container spacing={3}>
                    <Grid item md={3} xs={12}>
                        <Typography variant="h5" sx={{ mb: 2 }}>DentaCare.</Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            Your smile is our priority. We provide quality dental care to ensure a brighter smile.
                        </Typography>
                        <List sx={{ display: 'flex', padding: 0 }}>
                            {[
                                { icon: <Twitter />, link: '#' },
                                { icon: <Facebook />, link: '#' },
                                { icon: <Instagram />, link: '#' },
                                { icon: <LinkedIn />, link: '#' },
                            ].map(({ icon, link }, index) => (
                                <ListItem key={index}>
                                    <IconButton component={Link} href={link} color="inherit" aria-label={`Visit our ${link}`}>
                                        {icon}
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item md={2} xs={12}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Quick Links</Typography>
                        <List>
                            {["About Us", "Services", "Testimonials", "Blog", "Contact Us"].map((text) => (
                                <ListItem key={text}>
                                    <Link href="#" color="inherit" underline="none" sx={{ '&:hover': { textDecoration: 'underline' } }}>{text}</Link>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Recent Blog</Typography>
                        {["image_1.jpg", "image_2.jpg"].map((img, index) => (
                            <Box key={index} display="flex" mb={2}>
                                <Box
                                    component="span"
                                    sx={{
                                        backgroundImage: `url(images/${img})`,
                                        backgroundSize: 'cover',
                                        width: 80,
                                        height: 80,
                                        borderRadius: 1,
                                        mr: 2,
                                    }}
                                />
                                <Box>
                                    <Typography variant="body2">
                                        <Link href="#" color="inherit" underline="none" sx={{ '&:hover': { textDecoration: 'underline' } }}>Even the all-powerful Pointing has no control about</Link>
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        <CalendarToday fontSize="small" /> Sept 15, 2018 <Person fontSize="small" /> Admin <Chat fontSize="small" /> 19
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Contact Us</Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <MapIcon />
                                </ListItemIcon>
                                <Typography variant="body2">203 Fake St. Mountain View, San Francisco, California, USA</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Phone />
                                </ListItemIcon>
                                <Link href="tel:+23923929210" color="inherit">+2 392 3929 210</Link>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Email />
                                </ListItemIcon>
                                <Link href="mailto:info@yourdomain.com" color="inherit">info@yourdomain.com</Link>
                            </ListItem>
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" sx={{ mb: 1 }}>Emergency Services :</Typography>
                        <Button
                            variant="text"
                            color="primary"
                            size="small"
                            href="#"
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                            }}
                        >
                            Call Now
                        </Button>
                    </Grid>
                </Grid>
                <Grid container justifyContent="center" sx={{ mt: 4 }}>
                <Typography variant="body2" textAlign="center">
                        &copy; {new Date().getFullYear()} All rights reserved | This template is made with <span role="img" aria-label="heart">❤️</span> by <Link href="#" target="_blank" color="inherit">Abdo Mhmd</Link>
                    </Typography>
                </Grid>
            </Container>
        </Box>
    );
};

export default FooterSection;
