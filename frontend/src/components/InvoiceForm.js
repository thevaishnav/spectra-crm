import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
];

export default function InvoiceForm({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    client: '',
    workOrder: '',
    amount: '',
    status: 'pending',
    dueDate: '',
    paidDate: '',
    remarks: '',
    assignedSPOC: '',
  });
  const [clients, setClients] = useState([]);
  const [spocs, setSpocs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      axios.get('/api/clients').then(res => setClients(res.data));
      axios.get('/api/users').then(res => setSpocs(res.data));
      if (initialData) {
        setForm({ ...initialData, dueDate: initialData.dueDate ? initialData.dueDate.slice(0,10) : '', paidDate: initialData.paidDate ? initialData.paidDate.slice(0,10) : '' });
      } else {
        setForm({ client: '', workOrder: '', amount: '', status: 'pending', dueDate: '', paidDate: '', remarks: '', assignedSPOC: '' });
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
      <DialogTitle>{initialData ? 'Edit Invoice' : 'Add Invoice'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField select label="Client" name="client" value={form.client} onChange={handleChange} fullWidth margin="normal" required>
            <MenuItem value="">Select Client</MenuItem>
            {clients.map(c => <MenuItem key={c._id} value={c._id}>{c.clientName}</MenuItem>)}
          </TextField>
          <TextField label="Amount" name="amount" value={form.amount} onChange={handleChange} fullWidth margin="normal" required type="number" />
          <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth margin="normal" required>
            {statusOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </TextField>
          <TextField label="Due Date" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
          <TextField label="Paid Date" name="paidDate" type="date" value={form.paidDate} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <TextField label="Remarks" name="remarks" value={form.remarks} onChange={handleChange} fullWidth margin="normal" multiline rows={2} />
          <TextField select label="SPOC" name="assignedSPOC" value={form.assignedSPOC} onChange={handleChange} fullWidth margin="normal" required>
            <MenuItem value="">Select SPOC</MenuItem>
            {spocs.map(u => <MenuItem key={u._id} value={u._id}>{u.name} ({u.role})</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>{initialData ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 