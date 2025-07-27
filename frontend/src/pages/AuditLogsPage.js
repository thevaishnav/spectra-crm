import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/auditlogs').then(res => {
      setLogs(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>Audit Logs</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
            ) : logs.length === 0 ? (
              <TableRow><TableCell colSpan={5}>No logs found.</TableCell></TableRow>
            ) : logs.map(log => (
              <TableRow key={log._id}>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.user?.name || '-'}</TableCell>
                <TableCell>{log.client?.clientName || '-'}</TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
} 