import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ModeratorRoute = ({ children }) => {
  const { role, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return role === 'moderator' ? children : <Navigate to="/unauthorized" />;
};

export default ModeratorRoute;
