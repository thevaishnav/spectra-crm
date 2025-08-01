const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [
      'CEO',
      'COO',
      'SPOC',
      'CRM_EXECUTIVE',
      'DOC_COMPLIANCE',
      'ACCOUNTS',
      'ADVISORY',
      'SUPPORT'
    ],
    required: true
  },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema); 