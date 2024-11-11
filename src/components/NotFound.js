import React from 'react';
import { Typography, Box } from '@mui/material';

function NotFound() {
    return (
        <Box>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                404 - Page Not Found
            </Typography>
            <Typography variant="body1">
                The page you are looking for does not exist.
            </Typography>
        </Box>
    );
}

export default NotFound;
