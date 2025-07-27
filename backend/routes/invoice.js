const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// List invoices (CEO/COO/Accounts see all, SPOC sees assigned)
router.get('/', auth, async (req, res) => {
  try {
    let invoices;
    if (['CEO', 'COO', 'ACCOUNTS'].includes(req.user.role)) {
      invoices = await Invoice.find();
    } else if (req.user.role === 'SPOC') {
      invoices = await Invoice.find({ assignedSPOC: req.user.id });
    } else {
      invoices = [];
    }
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create invoice (CEO/COO/Accounts only)
router.post('/', auth, role(['CEO', 'COO', 'ACCOUNTS']), async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update invoice (CEO/COO/Accounts only)
router.put('/:id', auth, role(['CEO', 'COO', 'ACCOUNTS']), async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete invoice (CEO/COO/Accounts only)
router.delete('/:id', auth, role(['CEO', 'COO', 'ACCOUNTS']), async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 