import React, { useEffect, useState } from 'react';
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

const mockCompliance = [
  {
    id: 1,
    client: 'ABC Realty',
    service: 'QPR',
    deadline: '2024-07-20',
    reminder: '2024-06-25',
    spoc: 'John Doe',
    nextFollowUp: '2024-06-28',
    remarks: 'Waiting for docs',
  },
  {
    id: 2,
    client: 'XYZ Infra',
    service: 'CA Certificate',
    deadline: '2024-07-20',
    reminder: '2024-06-25',
    spoc: 'Jane Smith',
    nextFollowUp: '2024-06-30',
    remarks: '',
  },
];

export default function ComplianceCalendarPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Replace with real API call
    setRows(mockCompliance);
  }, []);

  const handleUpdate = (id, field, value) => {
    setRows(rows => rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSave = (id) => {
    // Call API to save nextFollowUp and remarks
    // For now, just log
    const row = rows.find(r => r.id === id);
    alert(`Saved for ${row.client}: Next Follow-up ${row.nextFollowUp}, Remarks: ${row.remarks}`);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Compliance Calendar</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Reminder</TableCell>
              <TableCell>SPOC</TableCell>
              <TableCell>Next Follow-up</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow><TableCell colSpan={8}>No compliance items found.</TableCell></TableRow>
            ) : rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.client}</TableCell>
                <TableCell>{row.service}</TableCell>
                <TableCell>{row.deadline}</TableCell>
                <TableCell>{row.reminder}</TableCell>
                <TableCell>{row.spoc}</TableCell>
                <TableCell>
                  <TextField type="date" value={row.nextFollowUp} onChange={e => handleUpdate(row.id, 'nextFollowUp', e.target.value)} size="small" />
                </TableCell>
                <TableCell>
                  <TextField value={row.remarks} onChange={e => handleUpdate(row.id, 'remarks', e.target.value)} size="small" />
                </TableCell>
                <TableCell>
                  <Button size="small" variant="contained" onClick={() => handleSave(row.id)}>Save</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
} 