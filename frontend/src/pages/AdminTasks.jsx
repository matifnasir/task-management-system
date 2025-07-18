import React from 'react';
import Layout from '../components/Layout';

const AdminTasks = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-gray-600 mt-2">View and manage all system tasks</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500">Admin task management interface coming soon...</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminTasks;