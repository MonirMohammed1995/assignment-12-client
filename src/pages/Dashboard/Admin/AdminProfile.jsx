import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthProvider';

const AdminProfile = () => {
  const { user, role } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-60">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <section className="p-4 md:p-8">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 md:p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <img
            src={user.photoURL || 'https://i.ibb.co/yScsnC0/default-avatar.png'}
            alt="Profile"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-md border-4 border-primary"
          />
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
              {user.displayName || 'Admin User'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {user.email}
            </p>
            <p className="mt-2">
              <span className="inline-block bg-green-100 text-green-800 dark:bg-green-700 dark:text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {role || 'User'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProfile;
