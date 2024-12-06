import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import {
  Facebook,
  LinkedIn,
  WhatsApp,
  Share as ShareIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import { useTranslation } from 'react-i18next';

const BlogShareDialog = ({ blog }) => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const showSnackbar = useSnackbar();
  const isArabic = i18n.language === 'ar';

  const encodedUrl = encodeURIComponent(window.location.href);
  const encodedTitle = encodeURIComponent(blog?.title || '');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showSnackbar(t('Link copied to clipboard!'), 'success');
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="primary" aria-label={t('Share blog')}>
        <ShareIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
          {blog?.title || t('Blog Title')}
        </DialogTitle>

        <DialogContent>
          {blog?.imageUrl && (
            <Box
              component="img"
              src={blog.imageUrl}
              alt={blog?.title}
              sx={{ width: '100%', height: 'auto', mb: 2, borderRadius: 1 }}
            />
          )}
          <Typography variant="body1" component="p" paragraph>
            {blog?.content || blog?.description || t('No description available.')}
          </Typography>
        </DialogContent>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, py: 2 }}>
          {/* Facebook */}
          <IconButton
            component="a"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            aria-label={t('Share on Facebook')}
          >
            <Facebook />
          </IconButton>

          {/* LinkedIn */}
          <IconButton
            component="a"
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            aria-label={t('Share on LinkedIn')}
          >
            <LinkedIn />
          </IconButton>

          {/* WhatsApp */}
          <IconButton
            component="a"
            href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            aria-label={t('Share on WhatsApp')}
          >
            <WhatsApp />
          </IconButton>

          {/* Instagram */}
          <IconButton
            component="a"
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            aria-label={t('Share on Instagram')}
          >
            <InstagramIcon />
          </IconButton>

          {/* Copy Link */}
          <IconButton onClick={handleCopyLink} color="primary" aria-label={t('Copy link')}>
            <ContentCopyIcon />
          </IconButton>
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

export default BlogShareDialog;
