const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// List all clients (CEO/COO see all, others see assigned)
router.get('/', auth, async (req, res) => {
  try {
    let clients;
    if (['CEO', 'COO'].includes(req.user.role)) {
      clients = await Client.find();
    } else {
      clients = await Client.find({ spoc: req.user.id });
    }
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create client (CEO/COO only)
router.post('/', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update client (CEO/COO or assigned SPOC)
router.put('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    if (!['CEO', 'COO'].includes(req.user.role) && String(client.spoc) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    Object.assign(client, req.body);
    await client.save();
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete client (CEO/COO only)
router.delete('/:id', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 