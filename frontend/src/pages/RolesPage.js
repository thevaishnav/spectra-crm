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
import { useFeedback } from '../contexts/FeedbackContext';
import LoadingSpinner from '../components/LoadingSpinner';
import RoleForm from '../components/RoleForm';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { show } = useFeedback();

  const fetchRoles = () => {
    setLoading(true);
    axios.get('/api/roles').then(res => {
      setRoles(res.data);
      setLoading(false);
    }).catch(err => {
      show('Failed to load roles', 'error');
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setFormOpen(true);
  };
  const handleEdit = (role) => {
    setEditData(role);
    setFormOpen(true);
  };
  const handleDelete = async (role) => {
    if (window.confirm('Delete this role?')) {
      try {
        await axios.delete(`/api/roles/${role._id}`);
        show('Role deleted successfully!', 'success');
        fetchRoles();
      } catch (err) {
        show(err.response?.data?.message || 'Delete failed', 'error');
      }
    }
  };
  const handleSave = async (data) => {
    try {
      if (editData) {
        await axios.put(`/api/roles/${editData._id}`, data);
        show('Role updated successfully!', 'success');
      } else {
        await axios.post('/api/roles', data);
        show('Role added successfully!', 'success');
      }
      setFormOpen(false);
      fetchRoles();
    } catch (err) {
      show(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>User Roles</Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleAdd}>
        Add Role
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5}><LoadingSpinner message="Loading roles..." /></TableCell></TableRow>
            ) : roles.length === 0 ? (
              <TableRow><TableCell colSpan={5}>No custom roles found.</TableCell></TableRow>
            ) : roles.map(role => (
              <TableRow key={role._id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  {role.permissions?.map(perm => (
                    <Chip key={perm} label={perm} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <Chip label={role.isActive ? 'Active' : 'Inactive'} color={role.isActive ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(role)}>Edit</Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(role)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <RoleForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initialData={editData} />
    </>
  );
} 