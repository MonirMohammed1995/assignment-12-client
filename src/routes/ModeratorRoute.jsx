import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const ModeratorRoute = ({ children }) => {
  const { role, loading } = useContext(AuthContext);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  return role === 'moderator' ? children : <Navigate to="/unauthorized" />;
};

export default ModeratorRoute;
