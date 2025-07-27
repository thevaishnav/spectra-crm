require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CRM backend running' });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

const clientRoutes = require('./routes/client');
app.use('/api/clients', clientRoutes);

const serviceRoutes = require('./routes/service');
app.use('/api/services', serviceRoutes);

const taskRoutes = require('./routes/task');
app.use('/api/tasks', taskRoutes);

const invoiceRoutes = require('./routes/invoice');
app.use('/api/invoices', invoiceRoutes);

const auditLogRoutes = require('./routes/auditlog');
app.use('/api/auditlogs', auditLogRoutes);

const roleRoutes = require('./routes/roles');
app.use('/api/roles', roleRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spectra_crm';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 