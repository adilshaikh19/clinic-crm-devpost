import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminPrescriptionsTest = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Prescriptions Test</h1>
      <div className="bg-green-100 border border-green-400 rounded p-4">
        <p><strong>Success!</strong> You've reached the admin prescriptions page.</p>
        <p><strong>User Role:</strong> {user?.role}</p>
        <p><strong>User Name:</strong> {user?.name}</p>
        <p><strong>Clinic ID:</strong> {user?.clinicId}</p>
      </div>
    </div>
  );
};

export default AdminPrescriptionsTest;