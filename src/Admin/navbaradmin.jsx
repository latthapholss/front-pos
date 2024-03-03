import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { alpha } from '@mui/material/styles';

function Navbaradmin({ person }) {
  const reducedIntensityColor = alpha('#888888', 0.5);
  const lightGreyColor = '#F0F0F0';
  if (person && person.user_type === 0) {
    // Admin user
  } else if (person && person.user_type === 1) {
    // Employee user
  } else if (person && person.user_type === 2) {
    // Member user
  }
  return (
    <AppBar position="static" sx={{ height: '60px', backgroundColor: 'white' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: lightGreyColor }}>
        </Typography>
        <Button component={Link} to="/" color="inherit">
          Home
        </Button>
        <Button component={Link} to="/about" color="inherit">
          About
        </Button>
        <Button component={Link} to="/contact" color="inherit">
          Contact
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbaradmin;
