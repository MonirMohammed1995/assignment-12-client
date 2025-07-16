import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthProvider';

const AdminProfile = () => {
  const { user, role } = useContext(AuthContext);

  if (!user) {
    return <p>Loading...</p>; // or redirect/login message
  }

  return (
    <section className="p-6 md:p-10">
      <div className="flex flex-col items-center gap-4">
        <img
          src={user.photoURL || '/default-profile.png'}
          alt="Profile"
          className="w-32 h-32 rounded-full shadow-lg"
        />
        <h2 className="text-2xl font-semibold">{user.displayName || user.email}</h2>
        {role !== 'user' && (
          <span className="badge badge-success uppercase">{role}</span>
        )}
      </div>
    </section>
  );
};

export default AdminProfile;
