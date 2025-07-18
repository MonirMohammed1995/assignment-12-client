// UserRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const UserRoute = ({ children }) => {
  const { role, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return role === 'user' ? children : <Navigate to="/unauthorized" />;
};

export default UserRoute;
