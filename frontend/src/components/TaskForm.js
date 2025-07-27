import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';

export default function TaskForm({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    client: '',
    workOrder: '',
    assignedTo: '',
    dueDate: '',
    urgency: false,
    remarks: '',
  });
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      axios.get('/api/clients').then(res => setClients(res.data));
      axios.get('/api/users').then(res => setUsers(res.data));
      if (initialData) {
        setForm({ ...initialData, dueDate: initialData.dueDate ? initialData.dueDate.slice(0,10) : '' });
      } else {
        setForm({ client: '', workOrder: '', assignedTo: '', dueDate: '', urgency: false, remarks: '' });
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
      <DialogTitle>{initialData ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField select label="Client" name="client" value={form.client} onChange={handleChange} fullWidth margin="normal" required>
            <MenuItem value="">Select Client</MenuItem>
            {clients.map(c => <MenuItem key={c._id} value={c._id}>{c.clientName}</MenuItem>)}
          </TextField>
          <TextField select label="Assigned To" name="assignedTo" value={form.assignedTo} onChange={handleChange} fullWidth margin="normal" required>
            <MenuItem value="">Select User</MenuItem>
            {users.map(u => <MenuItem key={u._id} value={u._id}>{u.name} ({u.role})</MenuItem>)}
          </TextField>
          <TextField label="Due Date" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
          <FormControlLabel control={<Checkbox checked={form.urgency} onChange={handleChange} name="urgency" />} label="Urgent" />
          <TextField label="Remarks" name="remarks" value={form.remarks} onChange={handleChange} fullWidth margin="normal" multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>{initialData ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 