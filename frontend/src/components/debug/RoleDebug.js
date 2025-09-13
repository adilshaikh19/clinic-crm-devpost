import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RoleDebug = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h3 className="font-bold text-yellow-800">Debug Info</h3>
      <p><strong>Authenticated:</strong> {isAuthenticated() ? 'Yes' : 'No'}</p>
      <p><strong>User:</strong> {JSON.stringify(user, null, 2)}</p>
      <p><strong>Role:</strong> {user?.role}</p>
      <p><strong>Clinic ID:</strong> {user?.clinicId}</p>
    </div>
  );
};

export default RoleDebug;