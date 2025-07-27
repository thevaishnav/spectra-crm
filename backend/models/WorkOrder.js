const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WorkOrder', workOrderSchema); 