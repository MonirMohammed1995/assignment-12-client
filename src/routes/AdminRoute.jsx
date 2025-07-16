// src/routes/AdminRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const AdminRoute = ({ children }) => {
  const { role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-semibold text-indigo-600 animate-pulse">
          Checking admin access...
        </span>
      </div>
    );
  }

  return role === 'admin' ? children : <Navigate to="/unauthorized" replace />;
};

export default AdminRoute;
