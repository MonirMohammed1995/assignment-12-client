import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const UserRoute = ({ children }) => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (!user) {
    // User not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (role !== 'user') {
    // User authenticated but role is not 'user'
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has 'user' role, render children
  return children;
};

export default UserRoute;
