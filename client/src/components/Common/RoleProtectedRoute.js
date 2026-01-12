/**
 * RoleProtectedRoute Component
 * Restricts access to components based on user role
 */

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginContext } from './Context/Context';
import authService from '../services/authService';

const RoleProtectedRoute = ({ element, requiredRole = 'user' }) => {
  const { logindata } = useContext(LoginContext);

  // Check if user is authenticated and has required role
  if (!logindata || !logindata.ValidUserOne) {
    return <Navigate to="/login" replace />;
  }

  const user = logindata.ValidUserOne;
  const userRole = user.role || 'user';

  // Check role permissions
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dash" replace />;
  }

  return element;
};

export default RoleProtectedRoute;
