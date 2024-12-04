import React, { useState, createContext, useContext } from 'react';
import { Snackbar, Typography, Box, IconButton } from '@mui/material';
import { Close, CheckCircle, Warning, Info, Error } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Create a Context for Snackbar
const SnackbarContext = createContext();

// Custom hook to use Snackbar
export const useSnackbar = () => useContext(SnackbarContext);

// Snackbar Provider Component
const SnackbarProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [position, setPosition] = useState({ vertical: 'top', horizontal: 'right' });

    const showSnackbar = (msg, sev = 'success', pos = { vertical: 'top', horizontal: 'right' }) => {
        setMessage(msg);
        setSeverity(sev);
        setPosition(pos);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const handleExited = () => {
        setMessage('');
    };

    const Transition = React.forwardRef(function Transition(props, ref) {
        return (
            <motion.div
                ref={ref}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                {...props}
            />
        );
    });

    const severityIcons = {
        success: <CheckCircle fontSize="small" sx={{ color: '#4caf50', marginRight: '8px' }} />,
        error: <Error fontSize="small" sx={{ color: '#f44336', marginRight: '8px' }} />,
        warning: <Warning fontSize="small" sx={{ color: '#ff9800', marginRight: '8px' }} />,
        info: <Info fontSize="small" sx={{ color: '#2196f3', marginRight: '8px' }} />,
    };

    const styles = {
        container: {
            backgroundColor: {
                success: '#e8f5e9',
                error: '#ffebee',
                warning: '#fff3e0',
                info: '#e3f2fd',
            }[severity],
            borderRadius: '12px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.25)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            minWidth: '300px',
            maxWidth: '400px',
            position: 'relative',
        },
        message: {
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 500,
            color: {
                success: '#4caf50',
                error: '#f44336',
                warning: '#ff9800',
                info: '#2196f3',
            }[severity],
            marginLeft: '8px',
            marginRight: '8px',
            
        }
    };

    return (
        <SnackbarContext.Provider value={showSnackbar}>
            {children}
            <Snackbar
                open={open}
                onClose={handleClose}
                autoHideDuration={5000}
                anchorOrigin={position}
                TransitionComponent={Transition}
                TransitionProps={{ onExited: handleExited }}
            >
                <Box sx={styles.container}>
                    {severityIcons[severity]}
                    <IconButton
                        size="small"
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            left: '8px',
                            color: 'inherit',
                        }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                    <Typography sx={styles.message}>{message}</Typography>
                </Box>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export default SnackbarProvider;
