const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  details: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AuditLog', auditLogSchema); 