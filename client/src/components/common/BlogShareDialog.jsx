import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box } from '@mui/material';
import { Facebook, LinkedIn, WhatsApp } from '@mui/icons-material';
import InstagramIcon from '@mui/icons-material/Instagram';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from '../../contexts/SnackbarProvider';

const BlogShareDialog = ({ blog }) => {
  const [open, setOpen] = useState(false);
  const showSnackbar = useSnackbar();
  const encodedUrl = encodeURIComponent(window.location.href);
  const encodedTitle = encodeURIComponent(blog.title);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showSnackbar('Link copied to clipboard!', 'success');
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="primary">
        <ShareIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>{blog.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" component="p" paragraph>
            {blog.content || blog.description}
          </Typography>
        </DialogContent>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <IconButton
            component="a"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            color="primary"
          >
            <Facebook />
          </IconButton>
          <IconButton
            component="a"
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
            target="_blank"
            color="primary"
          >
            <LinkedIn />
          </IconButton>
          <IconButton
            component="a"
            href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            color="primary"
          >
            <WhatsApp />
          </IconButton>
          <IconButton
            component="a"
            href={`https://www.instagram.com/`}
            target="_blank"
            color="primary"
          >
            <InstagramIcon />
          </IconButton>
          <IconButton onClick={handleCopyLink} color="primary">
            <ContentCopyIcon />
          </IconButton>
        </Box>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BlogShareDialog;
