import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const mockLogs = [
  {
    id: 1,
    client: 'ABC Realty',
    date: '2024-06-25',
    message: 'Reminder: QPR due soon',
    status: 'sent',
    remarks: 'Client acknowledged',
  },
  {
    id: 2,
    client: 'XYZ Infra',
    date: '2024-06-26',
    message: 'Reminder: CA Certificate pending',
    status: 'pending',
    remarks: '',
  },
];

export default function WhatsAppLogPage() {
  const [rows, setRows] = useState(mockLogs);
  const [newLog, setNewLog] = useState({ client: '', date: '', message: '', status: 'pending', remarks: '' });

  const handleChange = (e) => {
    setNewLog({ ...newLog, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!newLog.client || !newLog.date || !newLog.message) return;
    setRows([...rows, { ...newLog, id: Date.now() }]);
    setNewLog({ client: '', date: '', message: '', status: 'pending', remarks: '' });
  };

  const handleStatusChange = (id, status) => {
    setRows(rows => rows.map(row => row.id === id ? { ...row, status } : row));
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>WhatsApp Follow-up Log</Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow><TableCell colSpan={6}>No WhatsApp logs found.</TableCell></TableRow>
            ) : rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.client}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.message}</TableCell>
                <TableCell>
                  <TextField select value={row.status} onChange={e => handleStatusChange(row.id, e.target.value)} size="small">
                    <MenuItem value="sent">Sent</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>{row.remarks}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell><TextField name="client" value={newLog.client} onChange={handleChange} size="small" placeholder="Client" /></TableCell>
              <TableCell><TextField name="date" type="date" value={newLog.date} onChange={handleChange} size="small" /></TableCell>
              <TableCell><TextField name="message" value={newLog.message} onChange={handleChange} size="small" placeholder="Message" /></TableCell>
              <TableCell>
                <TextField select name="status" value={newLog.status} onChange={handleChange} size="small">
                  <MenuItem value="sent">Sent</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </TextField>
              </TableCell>
              <TableCell><TextField name="remarks" value={newLog.remarks} onChange={handleChange} size="small" placeholder="Remarks" /></TableCell>
              <TableCell><Button size="small" variant="contained" onClick={handleAdd}>Add</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
} 