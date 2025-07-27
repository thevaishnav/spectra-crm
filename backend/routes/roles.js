const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// List all roles
router.get('/', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create role (CEO/COO only)
router.post('/', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    const role = new Role({ ...req.body, createdBy: req.user.id });
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update role (CEO/COO only)
router.put('/:id', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete role (CEO/COO only)
router.delete('/:id', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 