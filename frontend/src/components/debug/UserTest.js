import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserTest = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Debug Information</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Authentication Status</h2>
        <p><strong>Is Authenticated:</strong> {isAuthenticated() ? 'Yes' : 'No'}</p>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
      </div>

      <div className="bg-blue-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">User Object</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="bg-green-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Role Check</h2>
        <p><strong>Current Role:</strong> {user?.role || 'No role'}</p>
        <p><strong>Is clinic_admin:</strong> {user?.role === 'clinic_admin' ? 'Yes' : 'No'}</p>
        <p><strong>Role Type:</strong> {typeof user?.role}</p>
      </div>

      <div className="bg-yellow-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Test Links</h2>
        <div className="space-y-2">
          <a href="/admin" className="block text-blue-600 hover:underline">Admin Dashboard</a>
          <a href="/admin/prescriptions" className="block text-blue-600 hover:underline">Admin Prescriptions</a>
          <a href="/doctor" className="block text-blue-600 hover:underline">Doctor Dashboard</a>
        </div>
      </div>
    </div>
  );
};

export default UserTest;