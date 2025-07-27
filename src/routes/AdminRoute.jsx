import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const AdminRoute = ({ children }) => {
  const { role, loading, user } = useContext(AuthContext);
  const location = useLocation();

  if (loading || !user || role === null || typeof role === 'undefined') {
    return <p className="text-center mt-10 font-semibold text-gray-500">Loading...</p>;
  }

  if (role === 'admin') {
    return children;
  }

  // Redirect to unauthorized but save location for future use
  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
