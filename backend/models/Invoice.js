const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  workOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'partial', 'paid', 'overdue'], default: 'pending' },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  remarks: String,
  assignedSPOC: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', invoiceSchema); 