import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

export default function ClientForm({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    clientName: '',
    companyName: '',
    projectName: '',
    signatoryName: '',
    signatoryContact: '',
    spoc: '',
    onboardingDate: '',
  });
  const [spocs, setSpocs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      axios.get('/api/users').then(res => {
        setSpocs(res.data);
      });
      if (initialData) {
        setForm({ ...initialData, onboardingDate: initialData.onboardingDate ? initialData.onboardingDate.slice(0,10) : '' });
      } else {
        setForm({
          clientName: '', companyName: '', projectName: '', signatoryName: '', signatoryContact: '', spoc: '', onboardingDate: ''
        });
      }
    }
  }, [open, initialData]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Client' : 'Add Client'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField label="Client Name" name="clientName" value={form.clientName} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Project Name" name="projectName" value={form.projectName} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Authorized Signatory Name" name="signatoryName" value={form.signatoryName} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Signatory Contact" name="signatoryContact" value={form.signatoryContact} onChange={handleChange} fullWidth margin="normal" />
          <TextField select label="SPOC" name="spoc" value={form.spoc} onChange={handleChange} fullWidth margin="normal" required>
            <MenuItem value="">Select SPOC</MenuItem>
            {spocs.map(u => <MenuItem key={u._id} value={u._id}>{u.name} ({u.role})</MenuItem>)}
          </TextField>
          <TextField label="Onboarding Date" name="onboardingDate" type="date" value={form.onboardingDate} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>{initialData ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 