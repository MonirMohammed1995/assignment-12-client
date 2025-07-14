import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { role, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return role === 'admin' ? children : <Navigate to="/unauthorized" />;
};

export default AdminRoute;
