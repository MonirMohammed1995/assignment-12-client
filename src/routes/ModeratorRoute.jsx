// src/routes/ModeratorRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const ModeratorRoute = ({ children }) => {
  const { role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-semibold text-indigo-600 animate-pulse">
          Checking permissions...
        </span>
      </div>
    );
  }

  return role === 'moderator' ? children : <Navigate to="/unauthorized" replace />;
};

export default ModeratorRoute;
