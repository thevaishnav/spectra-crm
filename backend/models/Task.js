const mongoose = require('mongoose');

const taskHistorySchema = new mongoose.Schema({
  action: String,
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  at: { type: Date, default: Date.now },
  remarks: String,
});

const taskSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  workOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'overdue', 'escalated'], default: 'pending' },
  remarks: String,
  urgency: { type: Boolean, default: false },
  escalated: { type: Boolean, default: false },
  history: [taskHistorySchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema); 