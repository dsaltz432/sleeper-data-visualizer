import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <AppBar position="static">
            <Toolbar className="navbar-wrapper">
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    The Last League Super Duper Expert Analysis
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }} className="nav-buttons-container">
                    <Button
                        component={Link}
                        to="/standings"
                        className={`nav-button ${currentPath === '/standings' ? 'active' : ''}`}
                    >
                        Standings
                    </Button>
                    <Button
                        component={Link}
                        to="/matchups"
                        className={`nav-button ${currentPath === '/matchups' ? 'active' : ''}`}
                    >
                        Matchups
                    </Button>
                    <Button
                        component={Link}
                        to="/methodology"
                        className={`nav-button ${currentPath === '/methodology' ? 'active' : ''}`}
                    >
                        Methodology
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
