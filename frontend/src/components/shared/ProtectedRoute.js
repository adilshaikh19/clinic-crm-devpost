import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Handle both single role string and array of roles
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    console.log('ProtectedRoute Debug:', {
      userRole: user?.role,
      requiredRole,
      allowedRoles,
      isAllowed: allowedRoles.includes(user?.role)
    });
    
    if (!allowedRoles.includes(user?.role)) {
      console.log('Access denied - redirecting to unauthorized');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;