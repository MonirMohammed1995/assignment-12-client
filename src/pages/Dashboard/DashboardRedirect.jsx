import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';

const DashboardRedirect = () => {
  const { role, loading } = useContext(AuthContext);

  if (loading) {
    return <p className="text-center mt-20">Loading dashboard...</p>;
  }

  if (role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  if (role === 'moderator') return <Navigate to="/dashboard/moderator" replace />;
  if (role === 'user') return <Navigate to="/dashboard/user" replace />;

  return <Navigate to="/unauthorized" replace />;
};

export default DashboardRedirect;
