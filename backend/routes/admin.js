const express = require('express');
const {
  getAllUsers,
  promoteToAdmin,
  demoteToUser,
  deleteUser,
  getAllTasks,
  getDashboardStats
} = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Admin dashboard routes
router.get('/dashboard/stats', getDashboardStats);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:userId/promote', promoteToAdmin);
router.put('/users/:userId/demote', demoteToUser);
router.delete('/users/:userId', deleteUser);

// Task management routes (admin view all tasks)
router.get('/tasks', getAllTasks);

module.exports = router;