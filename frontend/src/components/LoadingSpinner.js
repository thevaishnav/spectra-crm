import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3}>
      <CircularProgress size={40} />
      <Typography variant="body2" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
} 