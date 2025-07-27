import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const FeedbackContext = createContext();

export function useFeedback() {
  return useContext(FeedbackContext);
}

export function FeedbackProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const show = (msg, sev = 'success') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <FeedbackContext.Provider value={{ show }}>
      {children}
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
} 