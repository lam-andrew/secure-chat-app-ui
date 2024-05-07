import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useUser();

  if (!user) {
    // Redirect to the login page if there is no user
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; // Render children when user is authenticated
};

export default ProtectedRoute;
