import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Facebook,
  LinkedIn,
  WhatsApp,
  Twitter,
  Share as ShareIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import { useTranslation } from 'react-i18next';

const BlogShareDialog = ({ blog }) => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const showSnackbar = useSnackbar();
  const isArabic = i18n.language === 'ar';

  const { encodedUrl, encodedTitle, fullEncodedText } = useMemo(() => {
    const url = window.location.href;
    const title = blog?.title || '';
    return {
      encodedUrl: encodeURIComponent(url),
      encodedTitle: encodeURIComponent(title),
      fullEncodedText: encodeURIComponent(`${title} ${url}`)
    };
  }, [blog]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSnackbar(t('Link copied to clipboard!'), 'success');
    } catch (error) {
      showSnackbar(t('Failed to copy the link. Please try again.'), 'error');
    }
  };

  const socialMediaButtons = [
    {
      label: t('Share on Facebook'),
      icon: <Facebook />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: t('Share on Twitter'),
      icon: <Twitter />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: t('Share on LinkedIn'),
      icon: <LinkedIn />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: t('Share on WhatsApp'),
      icon: <WhatsApp />,
      href: `https://wa.me/?text=${fullEncodedText}`,
    },
  ];

  return (
    <>
      <Tooltip title={t('Share blog')}>
        <IconButton onClick={handleOpen} color="primary" aria-label={t('Share blog')}>
          <ShareIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="blog-share-dialog-title"
      >
        <DialogTitle
          id="blog-share-dialog-title"
          sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}
        >
          {blog?.title || t('Blog Title')}
        </DialogTitle>

        <DialogContent dividers>
          {blog?.imageUrl && (
            <Box
              component="img"
              src={blog.imageUrl}
              alt={blog?.title}
              sx={{
                width: '100%',
                height: 200,
                mb: 2,
                borderRadius: 1,
                objectFit: 'cover',
              }}
            />
          )}
          <Typography variant="body1" component="p" paragraph>
            {blog?.content || blog?.description || t('No description available.')}
          </Typography>
        </DialogContent>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            py: 2,
            flexWrap: 'wrap',
          }}
        >
          {socialMediaButtons.map((button, index) => (
            <Tooltip key={index} title={button.label}>
              <IconButton
                component="a"
                href={button.href}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                aria-label={button.label}
              >
                {button.icon}
              </IconButton>
            </Tooltip>
          ))}

          <Tooltip title={t('Copy link')}>
            <IconButton
              onClick={handleCopyLink}
              color="primary"
              aria-label={t('Copy link')}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleClose} color="primary" variant="contained">
            {isArabic ? 'إغلاق' : t('Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

BlogShareDialog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
  }).isRequired,
};

export default BlogShareDialog;