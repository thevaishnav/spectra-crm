import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const availablePermissions = [
  'view_dashboard', 'manage_clients', 'manage_tasks', 'manage_services', 
  'manage_invoices', 'manage_users', 'view_audit_logs', 'manage_roles'
];

export default function RoleForm({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    permissions: [],
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm(initialData);
      } else {
        setForm({ name: '', description: '', permissions: [], isActive: true });
      }
    }
  }, [open, initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handlePermissionToggle = (permission) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Role' : 'Add Role'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField label="Role Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" multiline rows={2} />
          
          <Box sx={{ mt: 2 }}>
            <TextField label="Permissions" fullWidth margin="normal" disabled value="Select permissions below" />
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availablePermissions.map(permission => (
                <Chip
                  key={permission}
                  label={permission.replace('_', ' ')}
                  onClick={() => handlePermissionToggle(permission)}
                  color={form.permissions.includes(permission) ? 'primary' : 'default'}
                  variant={form.permissions.includes(permission) ? 'filled' : 'outlined'}
                  clickable
                />
              ))}
            </Box>
          </Box>
          
          <FormControlLabel control={<Checkbox checked={form.isActive} onChange={handleChange} name="isActive" />} label="Active" />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>{initialData ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 