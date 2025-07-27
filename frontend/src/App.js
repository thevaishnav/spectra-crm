import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import TasksPage from './pages/TasksPage';
import ServicesPage from './pages/ServicesPage';
import InvoicesPage from './pages/InvoicesPage';
import AuditLogsPage from './pages/AuditLogsPage';
import ComplianceCalendarPage from './pages/ComplianceCalendarPage';
import WhatsAppLogPage from './pages/WhatsAppLogPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
              <Route path="/clients" element={<PrivateRoute><ClientsPage /></PrivateRoute>} />
              <Route path="/tasks" element={<PrivateRoute><TasksPage /></PrivateRoute>} />
              <Route path="/services" element={<PrivateRoute><ServicesPage /></PrivateRoute>} />
              <Route path="/invoices" element={<PrivateRoute><InvoicesPage /></PrivateRoute>} />
              <Route path="/auditlogs" element={<PrivateRoute><AuditLogsPage /></PrivateRoute>} />
              <Route path="/compliance-calendar" element={<PrivateRoute><ComplianceCalendarPage /></PrivateRoute>} />
              <Route path="/whatsapp-log" element={<PrivateRoute><WhatsAppLogPage /></PrivateRoute>} />
              <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
              <Route path="/roles" element={<PrivateRoute><RolesPage /></PrivateRoute>} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </>
  );
}

export default App;
