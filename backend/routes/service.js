const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// List all services
router.get('/', auth, async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create service (CEO/COO only)
router.post('/', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    const service = new Service({ ...req.body, createdBy: req.user.id });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update service (CEO/COO only)
router.put('/:id', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete service (CEO/COO only)
router.delete('/:id', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 