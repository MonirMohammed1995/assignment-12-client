// MyProfile.jsx
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthProvider';

const MyProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white p-6 rounded shadow">
      <img src={user.photoURL} alt="" className="w-24 h-24 rounded-full" />
      <h2 className="text-xl font-bold">{user.displayName}</h2>
      <p>{user.email}</p>
      {user.role !== 'user' && <p>Role: {user.role}</p>}
    </div>
  );
};

export default MyProfile;