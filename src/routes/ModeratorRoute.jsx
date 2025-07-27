import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const ModeratorRoute = ({ children }) => {
  const { user, role, loading } = useContext(AuthContext);
  const location = useLocation();

  // If loading OR user exists but role is still not set
  if (loading || (user && !role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-primary text-2xl"></span>
      </div>
    );
  }

  // Not logged in or not a moderator
  if (!user || role !== 'moderator') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ModeratorRoute;
