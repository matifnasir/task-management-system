const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const { User, Task } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Task Management System API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Database initialization and server startup
const initializeApp = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database models
    console.log('🔄 Synchronizing database models...');
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database models synchronized successfully.');
    
    // Create default admin user if it doesn't exist
    await createDefaultAdmin();
    
    // Create demo users if they don't exist
    await createDemoUsers();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 TMS Backend Server is running!`);
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`💾 Database: SQLite (task_management.db)`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📋 SQLite database ready for demo\n`);
    });
    
  } catch (error) {
    console.error('❌ Failed to initialize application:', error.message);
    process.exit(1);
  }
};

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'atifnasir83@gmail.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    
    if (!existingAdmin) {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Default admin user created');
      console.log(`📧 Admin Email: ${adminEmail}`);
      console.log(`🔑 Admin Password: admin123`);
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

// Create demo users
const createDemoUsers = async () => {
  try {
    const demoUsers = [
      {
        name: 'Mujassir Nasir',
        email: 'mujassirnasir@gmail.com',
        password: 'Mujassir123',
        role: 'user'
      },
      {
        name: 'Mustanser Nasir',
        email: 'mustansernasir@gmail.com',
        password: 'Mustanser123',
        role: 'user'
      }
    ];

    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Demo user created: ${userData.email}`);
      }
    }
  } catch (error) {
    console.error('❌ Error creating demo users:', error.message);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🔄 SIGINT received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

// Initialize the application
initializeApp();