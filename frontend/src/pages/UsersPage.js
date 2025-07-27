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
import UserForm from '../components/UserForm';
import { useFeedback } from '../contexts/FeedbackContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { show } = useFeedback();

  const fetchUsers = () => {
    setLoading(true);
    axios.get('/api/users').then(res => {
      setUsers(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setFormOpen(true);
  };
  const handleEdit = (user) => {
    setEditData(user);
    setFormOpen(true);
  };
  const handleDelete = async (user) => {
    if (window.confirm('Delete this user?')) {
      try {
        await axios.delete(`/api/users/${user._id}`);
        show('User deleted successfully!', 'success');
        fetchUsers();
      } catch (err) {
        show(err.response?.data?.message || 'Delete failed', 'error');
      }
    }
  };
  const handleSave = async (data) => {
    try {
      if (editData) {
        await axios.put(`/api/users/${editData._id}`, data);
        show('User updated successfully!', 'success');
      } else {
        await axios.post('/api/auth/register', data);
        show('User added successfully!', 'success');
      }
      setFormOpen(false);
      fetchUsers();
    } catch (err) {
      show(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleAdd}>
        Add User
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}><LoadingSpinner message="Loading users..." /></TableCell></TableRow>
            ) : users.length === 0 ? (
              <TableRow><TableCell colSpan={6}>No users found.</TableCell></TableRow>
            ) : users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Chip label={user.isActive ? 'Active' : 'Inactive'} color={user.isActive ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(user)}>Edit</Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(user)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UserForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initialData={editData} />
    </>
  );
} 