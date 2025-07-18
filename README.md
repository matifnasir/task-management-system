# 🎯 Task Management System (TMS)

A full-stack Task Management System built with modern web technologies, featuring role-based authentication, real-time task management, and a beautiful glassmorphism UI.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** with secure token management
- **Role-based Access Control** (Admin & Regular Users)
- **Password Hashing** with bcryptjs
- **Auto-logout** on token expiry
- **Protected Routes** with role-based restrictions

### 👑 Admin System
- **Admin Dashboard** with system statistics
- **User Management** (promote/demote users, delete accounts)
- **Task Overview** (view all user tasks)
- **Protected Admin Routes**
- **Main Admin Account**: `atifnasir83@gmail.com` / `admin123`

### 👤 User Management
- **Personal Task Management** (CRUD operations)
- **Task Filtering** by status (To Do, In Progress, Done)
- **Search Functionality** across tasks
- **Task Statistics** and dashboard overview

### 🎨 Modern UI/UX
- **Glassmorphism Design** with beautiful animations
- **Framer Motion** animations throughout the app
- **Responsive Design** with TailwindCSS
- **Toast Notifications** for user feedback
- **Loading States** and error handling

## 🧰 Tech Stack

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Router DOM** for routing
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MySQL** database (XAMPP setup)
- **Sequelize ORM** for database operations
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for frontend communication
- **Express Validator** for input validation

### Database
- **MySQL** running on XAMPP (localhost:3306)
- **Database Name**: `task_management`
- **Two main tables**: `users` and `tasks`
- **Automatic table creation** and relationship setup

## 📋 Demo Users

### Admin Account
- **Email**: `atifnasir83@gmail.com`
- **Password**: `admin123`
- **Role**: Admin (full system access)

### Regular Users
- **Email**: `mujassirnasir@gmail.com` / **Password**: `Mujassir123`
- **Email**: `mustansernasir@gmail.com` / **Password**: `Mustanser123`
- **Role**: User (personal task management only)

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **XAMPP** with MySQL running on port 3306
- **Git** for cloning the repository

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-management-system
```

### 2. Setup XAMPP MySQL Database
1. **Start XAMPP** and enable **Apache** and **MySQL**
2. **Access phpMyAdmin**: http://localhost/phpmyadmin
3. **Create Database**: Create a new database named `task_management`
4. **No need to create tables** - Sequelize will auto-create them

### 3. Install Dependencies
```bash
# Install root dependencies (for concurrently)
npm install

# Install backend dependencies
npm run backend:install

# Install frontend dependencies
npm run frontend:install
```

### 4. Configure Environment Variables
The backend `.env` file is already configured for XAMPP defaults:
```env
# Database Configuration (XAMPP MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=task_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 5. Start the Application

#### Option 1: Start Both Frontend and Backend Together
```bash
npm run dev
```

#### Option 2: Start Separately
```bash
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend  
npm run frontend:dev
```

### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health
- **phpMyAdmin**: http://localhost/phpmyadmin

## 📁 Project Structure

```
task-management-system/
├── backend/
│   ├── config/
│   │   └── database.js          # MySQL connection config
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── taskController.js    # Task CRUD operations
│   │   └── adminController.js   # Admin functionality
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Task.js              # Task model
│   │   └── index.js             # Model relationships
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── tasks.js             # Task routes
│   │   └── admin.js             # Admin routes
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Main layout component
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── Tasks.jsx        # Task management
│   │   │   ├── AdminDashboard.jsx # Admin dashboard
│   │   │   ├── AdminUsers.jsx   # User management
│   │   │   └── AdminTasks.jsx   # Admin task view
│   │   ├── utils/
│   │   │   └── api.js           # API configuration
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # App entry point
│   │   └── index.css            # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js       # TailwindCSS config
│   ├── postcss.config.js        # PostCSS config
│   └── vite.config.js           # Vite configuration
├── package.json                 # Root package.json
└── README.md                    # This file
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/verify` - Verify JWT token

### Tasks
- `GET /api/tasks` - Get user tasks (with pagination & filters)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

### Admin (Protected)
- `GET /api/admin/dashboard/stats` - Admin dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/promote` - Promote user to admin
- `PUT /api/admin/users/:id/demote` - Demote admin to user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/tasks` - Get all tasks (admin view)

## 🎯 Key Features Implemented

### ✅ Authentication System
- [x] JWT token generation and validation
- [x] Password hashing with bcrypt
- [x] Role-based access control
- [x] Auto-logout on token expiry
- [x] Protected routes

### ✅ User Management
- [x] User registration and login
- [x] User profile management
- [x] Admin promotion/demotion
- [x] User deletion (admin only)

### ✅ Task Management
- [x] CRUD operations for tasks
- [x] Task status management (To Do, In Progress, Done)
- [x] Task filtering and search
- [x] User-specific task access
- [x] Admin view of all tasks

### ✅ Frontend Features
- [x] Glassmorphism UI design
- [x] Responsive layout
- [x] Framer Motion animations
- [x] Toast notifications
- [x] Loading states
- [x] Error handling

### ✅ Database Integration
- [x] MySQL connection with Sequelize
- [x] Automatic table creation
- [x] Model relationships
- [x] Data validation

## 🚦 Getting Started Checklist

1. ✅ **XAMPP Setup**: Start Apache and MySQL
2. ✅ **Database Creation**: Create `task_management` database
3. ✅ **Dependencies**: Install all npm packages
4. ✅ **Environment**: Configure `.env` file
5. ✅ **Start Application**: Run `npm run dev`
6. ✅ **Test Login**: Use demo accounts to test functionality

## 🔧 Development Commands

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Start backend only
npm run backend:dev

# Start frontend only
npm run frontend:dev

# Build frontend for production
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure XAMPP MySQL is running on port 3306
   - Check if `task_management` database exists
   - Verify `.env` database credentials

2. **CORS Errors**
   - Frontend should run on http://localhost:5173
   - Backend should run on http://localhost:5000
   - Check FRONTEND_URL in `.env`

3. **Token Expired Errors**
   - Clear localStorage in browser
   - Restart the application
   - Check JWT_SECRET in `.env`

4. **Module Not Found Errors**
   - Run `npm run install:all`
   - Delete `node_modules` and reinstall
   - Check Node.js version (v16+)

## 📝 Future Enhancements

- [ ] Task categories and tags
- [ ] File attachments for tasks
- [ ] Task comments and collaboration
- [ ] Email notifications
- [ ] Task due dates and reminders
- [ ] Advanced reporting and analytics
- [ ] Mobile app with React Native
- [ ] Real-time updates with Socket.io

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🎉 Conclusion

This Task Management System demonstrates a complete full-stack application with modern technologies, secure authentication, role-based access control, and a beautiful user interface. It's ready for development and can be easily extended with additional features.

**Happy Task Managing! 🎯**