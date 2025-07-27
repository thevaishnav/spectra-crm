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
import Chip from '@mui/material/Chip';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import InvoiceForm from '../components/InvoiceForm';
import { useFeedback } from '../contexts/FeedbackContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { show } = useFeedback();

  const fetchInvoices = () => {
    setLoading(true);
    axios.get('/api/invoices').then(res => {
      setInvoices(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setFormOpen(true);
  };
  const handleEdit = (invoice) => {
    setEditData(invoice);
    setFormOpen(true);
  };
  const handleDelete = async (invoice) => {
    if (window.confirm('Delete this invoice?')) {
      try {
        await axios.delete(`/api/invoices/${invoice._id}`);
        show('Invoice deleted successfully!', 'success');
        fetchInvoices();
      } catch (err) {
        show(err.response?.data?.message || 'Delete failed', 'error');
      }
    }
  };
  const handleSave = async (data) => {
    try {
      if (editData) {
        await axios.put(`/api/invoices/${editData._id}`, data);
        show('Invoice updated successfully!', 'success');
      } else {
        await axios.post('/api/invoices', data);
        show('Invoice added successfully!', 'success');
      }
      setFormOpen(false);
      fetchInvoices();
    } catch (err) {
      show(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const canEdit = user && (['CEO', 'COO', 'ACCOUNTS'].includes(user.role));

  return (
    <>
      <Typography variant="h4" gutterBottom>Invoices</Typography>
      {canEdit && (
        <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleAdd}>
          Add Invoice
        </Button>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Paid Date</TableCell>
              <TableCell>SPOC</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={canEdit ? 7 : 6}><LoadingSpinner message="Loading invoices..." /></TableCell></TableRow>
            ) : invoices.length === 0 ? (
              <TableRow><TableCell colSpan={canEdit ? 7 : 6}>No invoices found.</TableCell></TableRow>
            ) : invoices.map(invoice => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice.client?.clientName || '-'}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Chip label={invoice.status} color={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'error' : 'warning'} size="small" />
                </TableCell>
                <TableCell>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{invoice.paidDate ? new Date(invoice.paidDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{invoice.assignedSPOC?.name || '-'}</TableCell>
                {canEdit && (
                  <TableCell>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(invoice)}>Edit</Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(invoice)}>Delete</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <InvoiceForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initialData={editData} />
    </>
  );
} 