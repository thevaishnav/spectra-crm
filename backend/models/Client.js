const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  type: { type: String, enum: ['call', 'email', 'whatsapp'], required: true },
  date: { type: Date, required: true },
  remarks: String,
  status: { type: String, enum: ['done', 'pending', 'skipped'], default: 'pending' },
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const documentLogSchema = new mongoose.Schema({
  name: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const clientSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  companyName: { type: String },
  projectName: { type: String },
  signatoryName: { type: String },
  signatoryContact: { type: String },
  spoc: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  onboardingDate: { type: Date, default: Date.now },
  servicesAvailed: [{ type: String }],
  projectCredentials: String,
  documentLog: [documentLogSchema],
  followUpHistory: [followUpSchema],
  paymentStatus: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
  workOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' }],
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }],
  serviceStatus: { type: String, enum: ['active', 'completed', 'on_hold', 'cancelled'], default: 'active' },
});

module.exports = mongoose.model('Client', clientSchema); 