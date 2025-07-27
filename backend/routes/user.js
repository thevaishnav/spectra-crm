const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// List all users (CEO/COO only)
router.get('/', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user (CEO/COO only)
router.put('/:id', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    const { name, email, role: userRole, phone, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role: userRole, phone, isActive },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete user (CEO/COO only)
router.delete('/:id', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 