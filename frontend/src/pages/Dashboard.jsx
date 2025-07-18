import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  Play,
  CheckCircle,
  Plus,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import Layout from '../components/Layout';
import { tasksAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch task stats and recent tasks
      const [statsResponse, tasksResponse] = await Promise.all([
        tasksAPI.getTaskStats(),
        tasksAPI.getTasks({ limit: 5 })
      ]);

      setStats(statsResponse.data.data.stats || []);
      setRecentTasks(tasksResponse.data.data.tasks || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatsCards = () => {
    const statusMap = {
      'To Do': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
      'In Progress': { icon: Play, color: 'text-blue-600', bg: 'bg-blue-100' },
      'Done': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' }
    };

    const defaultStats = [
      { status: 'To Do', count: 0 },
      { status: 'In Progress', count: 0 },
      { status: 'Done', count: 0 }
    ];

    // Merge actual stats with defaults
    const mergedStats = defaultStats.map(defaultStat => {
      const actualStat = stats.find(s => s.status === defaultStat.status);
      return actualStat || defaultStat;
    });

    return mergedStats.map((stat, index) => {
      const config = statusMap[stat.status];
      const Icon = config.icon;

      return (
        <motion.div
          key={stat.status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.status}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.count}</p>
            </div>
            <div className={`p-3 rounded-full ${config.bg}`}>
              <Icon className={`w-6 h-6 ${config.color}`} />
            </div>
          </div>
        </motion.div>
      );
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            Welcome back, {user?.name}!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 mt-2"
          >
            Here's an overview of your tasks and productivity.
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {getStatsCards()}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                <Link
                  to="/tasks"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {recentTasks.length > 0 ? (
                <div className="space-y-4">
                  {recentTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {task.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(task.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks yet</p>
                  <Link
                    to="/tasks"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create your first task
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <Link
                to="/tasks"
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Create New Task</h3>
                  <p className="text-sm text-gray-500">Add a new task to your list</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-gray-600" />
              </Link>

              <Link
                to="/tasks"
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <CheckSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">View All Tasks</h3>
                  <p className="text-sm text-gray-500">Manage your task list</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-gray-600" />
              </Link>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Productivity Tip</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Break down large tasks into smaller, manageable subtasks to improve your productivity and track progress more effectively.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;