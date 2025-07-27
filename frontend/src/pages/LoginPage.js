import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useFeedback } from '../contexts/FeedbackContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { show } = useFeedback();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      login(res.data.token);
      show('Login successful!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      show(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={2} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && <Typography color="error" variant="body2">{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Box>
  );
} 