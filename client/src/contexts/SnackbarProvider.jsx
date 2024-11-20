import React, { useState, createContext, useContext } from 'react';
import { Snackbar, SnackbarContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
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

    return (
        <SnackbarContext.Provider value={showSnackbar}>
            {children}
            <Snackbar
                anchorOrigin={position}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                TransitionProps={{ onExited: () => setMessage('') }}
            >
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <SnackbarContent
                        sx={{ 
                            backgroundColor: severity === 'error' ? 'error.main' : 'success.main', 
                            color: 'white',
                            display: 'flex', 
                            alignItems: 'center',
                            direction: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                        message={message}
                        action={
                            <IconButton
                                size="medium"
                                aria-label="close"
                                color="inherit"
                                onClick={handleClose}
                                sx={{ mr: 2 }}
                            >
                                <Close />
                            </IconButton>
                        }
                    />
                </motion.div>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};


export default SnackbarProvider;
