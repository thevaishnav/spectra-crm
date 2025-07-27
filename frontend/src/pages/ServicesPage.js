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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ServiceForm from '../components/ServiceForm';
import { useFeedback } from '../contexts/FeedbackContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { show } = useFeedback();

  const fetchServices = () => {
    setLoading(true);
    axios.get('/api/services').then(res => {
      setServices(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setFormOpen(true);
  };
  const handleEdit = (service) => {
    setEditData(service);
    setFormOpen(true);
  };
  const handleDelete = async (service) => {
    if (window.confirm('Delete this service?')) {
      try {
        await axios.delete(`/api/services/${service._id}`);
        show('Service deleted successfully!', 'success');
        fetchServices();
      } catch (err) {
        show(err.response?.data?.message || 'Delete failed', 'error');
      }
    }
  };
  const handleSave = async (data) => {
    try {
      if (editData) {
        await axios.put(`/api/services/${editData._id}`, data);
        show('Service updated successfully!', 'success');
      } else {
        await axios.post('/api/services', data);
        show('Service added successfully!', 'success');
      }
      setFormOpen(false);
      fetchServices();
    } catch (err) {
      show(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const canEdit = user && (user.role === 'CEO' || user.role === 'COO');

  return (
    <>
      <Typography variant="h4" gutterBottom>Services</Typography>
      {canEdit && (
        <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleAdd}>
          Add Service
        </Button>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Active</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={canEdit ? 4 : 3}><LoadingSpinner message="Loading services..." /></TableCell></TableRow>
            ) : services.length === 0 ? (
              <TableRow><TableCell colSpan={canEdit ? 4 : 3}>No services found.</TableCell></TableRow>
            ) : services.map(service => (
              <TableRow key={service._id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.isActive ? 'Yes' : 'No'}</TableCell>
                {canEdit && (
                  <TableCell>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(service)}>Edit</Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(service)}>Delete</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ServiceForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initialData={editData} />
    </>
  );
} 