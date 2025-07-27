const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require('../models/User');

// List tasks (team members see their own, CEO/COO see all)
router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    if (['CEO', 'COO'].includes(req.user.role)) {
      tasks = await Task.find().populate('client assignedTo workOrder');
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate('client workOrder');
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create task (CEO/COO only)
router.post('/', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    const task = new Task({ ...req.body, history: [{ action: 'created', by: req.user.id }] });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update task (assigned user or CEO/COO)
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!['CEO', 'COO'].includes(req.user.role) && String(task.assignedTo) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    Object.assign(task, req.body);
    task.history.push({ action: 'updated', by: req.user.id });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Escalate overdue urgent tasks (auto, for dashboard)
router.get('/escalated', auth, role(['CEO', 'COO']), async (req, res) => {
  try {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const tasks = await Task.find({
      status: { $in: ['pending', 'in_progress'] },
      urgency: true,
      dueDate: { $lte: threeDaysAgo },
      escalated: false,
    });
    // Optionally, mark as escalated
    await Task.updateMany({ _id: { $in: tasks.map(t => t._id) } }, { escalated: true, status: 'escalated' });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 