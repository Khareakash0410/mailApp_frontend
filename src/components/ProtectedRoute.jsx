import { Navigate } from 'react-router-dom';
import React from 'react';

const ProtectedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/signin" />;
};

export default ProtectedRoute;