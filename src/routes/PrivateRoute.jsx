// src/routes/PrivateRoute.jsx
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading || typeof user === 'undefined') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-medium text-gray-600 animate-pulse">
          Authenticating...
        </span>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
