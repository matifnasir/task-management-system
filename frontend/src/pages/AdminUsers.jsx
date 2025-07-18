import React from 'react';
import Layout from '../components/Layout';

const AdminUsers = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-2">View and manage system users</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500">User management interface coming soon...</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;