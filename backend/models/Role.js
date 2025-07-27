const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Role', roleSchema); 