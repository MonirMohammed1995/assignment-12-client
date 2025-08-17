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
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 transition-transform transform hover:scale-[1.02]">
        <div className="flex flex-col items-center gap-4">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={user.photoURL || 'https://i.ibb.co/yScsnC0/default-avatar.png'}
              alt={user.displayName || 'Admin profile'}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary shadow-md hover:shadow-xl transition-shadow"
            />
            {/* Active status indicator */}
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500 animate-pulse"></span>
          </div>

          {/* Name, Email, Role */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.displayName || 'Admin User'}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mt-1 break-all">{user.email}</p>
            <p className="mt-2">
              <span className="inline-block bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm">
                {role || 'User'}
              </span>
            </p>
          </div>

          {/* Optional Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 w-full text-center">
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
              <span className="block text-lg font-bold text-gray-900 dark:text-white">24</span>
              <span className="text-xs text-gray-500 dark:text-gray-300">Applications</span>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
              <span className="block text-lg font-bold text-gray-900 dark:text-white">12</span>
              <span className="text-xs text-gray-500 dark:text-gray-300">Reviews</span>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
              <span className="block text-lg font-bold text-gray-900 dark:text-white">3</span>
              <span className="text-xs text-gray-500 dark:text-gray-300">Pending Tasks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProfile;
