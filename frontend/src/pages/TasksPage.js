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
import Chip from '@mui/material/Chip';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import { useFeedback } from '../contexts/FeedbackContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { show } = useFeedback();

  const fetchTasks = () => {
    setLoading(true);
    axios.get('/api/tasks').then(res => {
      setTasks(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setFormOpen(true);
  };
  const handleEdit = (task) => {
    setEditData(task);
    setFormOpen(true);
  };
  const handleSave = async (data) => {
    try {
      if (editData) {
        await axios.put(`/api/tasks/${editData._id}`, data);
        show('Task updated successfully!', 'success');
      } else {
        await axios.post('/api/tasks', data);
        show('Task added successfully!', 'success');
      }
      setFormOpen(false);
      fetchTasks();
    } catch (err) {
      show(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date() && !['completed', 'escalated'].includes(task.status);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Tasks</Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleAdd}>
        Add Task
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Work Order</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Urgency</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7}><LoadingSpinner message="Loading tasks..." /></TableCell></TableRow>
            ) : tasks.length === 0 ? (
              <TableRow><TableCell colSpan={7}>No tasks found.</TableCell></TableRow>
            ) : tasks.map(task => (
              <TableRow key={task._id} sx={isOverdue(task) ? { bgcolor: '#fff3e0' } : {}}>
                <TableCell>{task.client?.clientName || '-'}</TableCell>
                <TableCell>{task.workOrder?._id || '-'}</TableCell>
                <TableCell>{task.assignedTo?.name || '-'}</TableCell>
                <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <Chip label={task.status} color={task.status === 'completed' ? 'success' : isOverdue(task) ? 'error' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  {task.urgency && <Chip label="Urgent" color="warning" size="small" />}
                  {task.escalated && <Chip label="Escalated" color="error" size="small" />}
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEdit(task)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TaskForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initialData={editData} />
    </>
  );
} 