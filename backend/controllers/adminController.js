const { User, Task } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    
    // Search in name and email
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        users: users.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: users.count,
          pages: Math.ceil(users.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting users'
    });
  }
};

// Promote user to admin
const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User is already an admin'
      });
    }

    await user.update({ role: 'admin' });

    res.json({
      success: true,
      message: 'User promoted to admin successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Promote to admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error promoting user to admin'
    });
  }
};

// Demote admin to user
const demoteToUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent demoting the main admin
    if (user.email === 'atifnasir83@gmail.com') {
      return res.status(403).json({
        success: false,
        message: 'Cannot demote the main admin account'
      });
    }

    if (user.role === 'user') {
      return res.status(400).json({
        success: false,
        message: 'User is already a regular user'
      });
    }

    await user.update({ role: 'user' });

    res.json({
      success: true,
      message: 'Admin demoted to user successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Demote to user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error demoting admin to user'
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting the main admin
    if (user.email === 'atifnasir83@gmail.com') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete the main admin account'
      });
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
};

// Get all tasks (admin only)
const getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    // Filter by user if provided
    if (userId) {
      whereClause.user_id = userId;
    }

    // Filter by status if provided
    if (status && ['To Do', 'In Progress', 'Done'].includes(status)) {
      whereClause.status = status;
    }

    // Search in title and description
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const tasks = await Task.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'role']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        tasks: tasks.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: tasks.count,
          pages: Math.ceil(tasks.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting tasks'
    });
  }
};

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.count();
    const totalAdmins = await User.count({ where: { role: 'admin' } });
    const totalTasks = await Task.count();

    // Get task statistics by status
    const taskStats = await Task.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get recent tasks
    const recentTasks = await Task.findAll({
      limit: 5,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['created_at', 'DESC']]
    });

    // Get recent users
    const recentUsers = await User.findAll({
      limit: 5,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalAdmins,
          totalTasks,
          taskStats
        },
        recentTasks,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting dashboard statistics'
    });
  }
};

module.exports = {
  getAllUsers,
  promoteToAdmin,
  demoteToUser,
  deleteUser,
  getAllTasks,
  getDashboardStats
};