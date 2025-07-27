import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  if (!user) return null;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleMenu} size="large">
        <AccountCircle />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disabled>
          <Typography variant="body2">{user.name} ({user.role})</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
} 