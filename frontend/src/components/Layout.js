import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BuildIcon from '@mui/icons-material/Build';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import SecurityIcon from '@mui/icons-material/Security';
import Box from '@mui/material/Box';
import UserMenu from './UserMenu';

const drawerWidth = 220;

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, roles: ['CEO', 'COO', 'CRM_EXECUTIVE', 'DOC_COMPLIANCE', 'ACCOUNTS', 'ADVISORY', 'SUPPORT'] },
  { label: 'Clients', path: '/clients', icon: <PeopleIcon />, roles: ['CEO', 'COO', 'CRM_EXECUTIVE'] },
  { label: 'Tasks', path: '/tasks', icon: <AssignmentIcon />, roles: ['CEO', 'COO', 'CRM_EXECUTIVE', 'DOC_COMPLIANCE', 'ACCOUNTS', 'ADVISORY', 'SUPPORT'] },
  { label: 'Services', path: '/services', icon: <BuildIcon />, roles: ['CEO', 'COO'] },
  { label: 'Invoices', path: '/invoices', icon: <ReceiptIcon />, roles: ['CEO', 'COO', 'ACCOUNTS'] },
  { label: 'Users', path: '/users', icon: <PeopleIcon />, roles: ['CEO', 'COO'] },
  { label: 'Roles', path: '/roles', icon: <SecurityIcon />, roles: ['CEO', 'COO'] },
  { label: 'Audit Logs', path: '/auditlogs', icon: <HistoryIcon />, roles: ['CEO', 'COO'] },
];

export default function Layout({ children }) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return children;

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {filteredNav.map(item => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Spectra CRM
          </Typography>
          <UserMenu />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}
      >
        {children}
      </Box>
    </Box>
  );
} 