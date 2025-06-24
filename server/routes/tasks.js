import express from 'express';
import { Task } from '../models/Task.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for authenticated user
router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
});

// Create new task
router.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, status = 'To Do' } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const validStatuses = ['To Do', 'In Progress', 'Done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid task status' });
    }

    const task = await Task.create({
      title: title.trim(),
      status,
      user_id: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
});

// Update task status
router.put('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title } = req.body;

    const task = await Task.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const validStatuses = ['To Do', 'In Progress', 'Done'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid task status' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (title) updateData.title = title.trim();

    await task.update(updateData);

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
});

// Delete task
router.delete('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
});

export default router;