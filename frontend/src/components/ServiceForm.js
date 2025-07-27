import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function ServiceForm({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm(initialData);
      } else {
        setForm({ name: '', description: '', isActive: true });
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
      <DialogTitle>{initialData ? 'Edit Service' : 'Add Service'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField label="Service Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" />
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