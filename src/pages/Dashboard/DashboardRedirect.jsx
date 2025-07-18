import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';

const DashboardRedirect = () => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'admin') navigate('/dashboard/admin');
    else if (role === 'moderator') navigate('/dashboard/moderator');
    else navigate('/dashboard/user');
  }, [role, navigate]);

  return null;
};

export default DashboardRedirect;
