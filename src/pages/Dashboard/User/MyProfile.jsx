import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthProvider';

const MyProfile = () => {
  const { user } = useContext(AuthContext);

  const defaultPhoto = 'https://via.placeholder.com/96?text=User';

  return (
    <section
      aria-labelledby="profile-heading"
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
        <img
          src={user?.photoURL || defaultPhoto}
          alt={user?.displayName ? `${user.displayName} profile picture` : 'User profile picture'}
          className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
          loading="lazy"
          width={96}
          height={96}
        />
        <div className="mt-4 sm:mt-0 text-center sm:text-left flex flex-col justify-center">
          <h1
            id="profile-heading"
            className="text-2xl font-semibold text-gray-900"
            tabIndex={0}
          >
            {user?.displayName || 'No Name Provided'}
          </h1>
          <p className="text-gray-600 mt-1 break-all" aria-label="User email">
            {user?.email || 'No Email Provided'}
          </p>
          {user?.role && user.role !== 'user' && (
            <p
              className="mt-2 inline-block px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full"
              aria-label={`User role: ${user.role}`}
            >
              Role: {user.role}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
