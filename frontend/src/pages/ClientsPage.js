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
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import ClientForm from '../components/ClientForm';
import { useFeedback } from '../contexts/FeedbackContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { show } = useFeedback();

  const fetchClients = () => {
    setLoading(true);
    axios.get('/api/clients').then(res => {
      setClients(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setFormOpen(true);
  };
  const handleEdit = (client) => {
    setEditData(client);
    setFormOpen(true);
  };
  const handleSave = async (data) => {
    try {
      if (editData) {
        await axios.put(`/api/clients/${editData._id}`, data);
        show('Client updated successfully!', 'success');
      } else {
        await axios.post('/api/clients', data);
        show('Client added successfully!', 'success');
      }
      setFormOpen(false);
      fetchClients();
    } catch (err) {
      show(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Clients</Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleAdd}>
        Add Client
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>SPOC</TableCell>
              <TableCell>Onboarding Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}><LoadingSpinner message="Loading clients..." /></TableCell></TableRow>
            ) : clients.length === 0 ? (
              <TableRow><TableCell colSpan={6}>No clients found.</TableCell></TableRow>
            ) : clients.map(client => (
              <TableRow key={client._id}>
                <TableCell>{client.clientName}</TableCell>
                <TableCell>{client.companyName}</TableCell>
                <TableCell>{client.projectName}</TableCell>
                <TableCell>{client.spoc?.name || '-'}</TableCell>
                <TableCell>{client.onboardingDate ? new Date(client.onboardingDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEdit(client)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ClientForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initialData={editData} />
    </>
  );
} 