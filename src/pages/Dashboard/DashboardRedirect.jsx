import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';

const DashboardRedirect = () => {
  const { user, role, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (role === 'admin') {
        navigate('/dashboard/admin');
      } else if (role === 'moderator') {
        navigate('/dashboard/moderator');
      } else {
        navigate('/dashboard/user');
      }
    }
  }, [user, role, loading, navigate]);

  return <p className="text-center mt-10">Redirecting...</p>;
};

export default DashboardRedirect;
