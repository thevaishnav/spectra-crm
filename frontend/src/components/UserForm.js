import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const roles = [
  'CEO', 'COO', 'CRM_EXECUTIVE', 'DOC_COMPLIANCE', 'ACCOUNTS', 'ADVISORY', 'SUPPORT'
];

export default function UserForm({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({ ...initialData, password: '' });
      } else {
        setForm({ name: '', email: '', password: '', role: '', phone: '', isActive: true });
      }
    }
  }, [open, initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit User' : 'Add User'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required type="email" />
          {!initialData && (
            <TextField label="Password" name="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required type="password" />
          )}
          <TextField select label="Role" name="role" value={form.role} onChange={handleChange} fullWidth margin="normal" required>
            <MenuItem value="">Select Role</MenuItem>
            {roles.map(role => <MenuItem key={role} value={role}>{role.replace('_', ' ')}</MenuItem>)}
          </TextField>
          <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth margin="normal" />
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