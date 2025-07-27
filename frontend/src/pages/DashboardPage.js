import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import LoadingSpinner from '../components/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    revenue: 0,
    paymentsPending: 0,
    activeClients: 0,
    teamWorkload: [],
    bottlenecks: [],
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with real API endpoints for dashboard summary
    async function fetchSummary() {
      setLoading(true);
      // Example: const res = await axios.get('/api/dashboard/summary');
      // setSummary(res.data);
      setSummary({
        revenue: 1200000,
        paymentsPending: 350000,
        activeClients: 120,
        teamWorkload: [
          { team: 'CRM', tasks: 12 },
          { team: 'Compliance', tasks: 8 },
          { team: 'Accounts', tasks: 5 },
        ],
        bottlenecks: [
          { type: 'Client Docs', count: 3 },
          { type: 'Internal Delay', count: 2 },
          { type: 'RERA Lag', count: 1 },
        ],
        overdueTasks: 4,
      });
      setLoading(false);
    }
    fetchSummary();
  }, []);

  const barData = {
    labels: summary.teamWorkload.map(t => t.team),
    datasets: [
      {
        label: 'Tasks',
        data: summary.teamWorkload.map(t => t.tasks),
        backgroundColor: '#1976d2',
      },
    ],
  };
  const pieData = {
    labels: summary.bottlenecks.map(b => b.type),
    datasets: [
      {
        data: summary.bottlenecks.map(b => b.count),
        backgroundColor: ['#ff9800', '#e57373', '#64b5f6'],
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Executive Dashboard</Typography>
      {loading ? (
        <LoadingSpinner message="Loading dashboard..." />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h5" color="primary">₹{summary.revenue.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Payments Pending</Typography>
                <Typography variant="h5" color="error">₹{summary.paymentsPending.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Active Clients</Typography>
                <Typography variant="h5">{summary.activeClients}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Overdue Tasks</Typography>
                <Typography variant="h5" color="error">{summary.overdueTasks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Team Workload</Typography>
                <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Bottlenecks</Typography>
                <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
} 