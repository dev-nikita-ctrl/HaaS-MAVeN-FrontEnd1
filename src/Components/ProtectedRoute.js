import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth'; // Adjust the path as needed

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
