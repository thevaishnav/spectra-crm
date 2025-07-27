const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// List all audit logs (CEO/COO only)
router.get('/', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 