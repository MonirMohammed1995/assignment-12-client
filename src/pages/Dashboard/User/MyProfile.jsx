import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthProvider';

const MyProfile = () => {
  const { user } = useContext(AuthContext);

  const defaultPhoto = 'https://via.placeholder.com/96?text=User';

  return (
    <section
      aria-labelledby="profile-heading"
      className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8 transition-transform transform hover:scale-[1.02]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
        <div className="relative w-28 h-28 mx-auto sm:mx-0">
          <img
            src={user?.photoURL || defaultPhoto}
            alt={user?.displayName ? `${user.displayName} profile picture` : 'User profile picture'}
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-sm hover:shadow-md transition-shadow"
            loading="lazy"
          />
          <span className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></span>
        </div>

        <div className="mt-4 sm:mt-0 text-center sm:text-left flex flex-col justify-center">
          <h1
            id="profile-heading"
            className="text-2xl font-bold text-gray-900"
            tabIndex={0}
          >
            {user?.displayName || 'No Name Provided'}
          </h1>
          <p className="text-gray-600 mt-1 break-all" aria-label="User email">
            {user?.email || 'No Email Provided'}
          </p>
          {user?.role && user.role !== 'user' && (
            <p
              className="mt-2 inline-block px-4 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full shadow-sm"
              aria-label={`User role: ${user.role}`}
            >
              Role: {user.role}
            </p>
          )}
        </div>
      </div>

      {/* Optional additional info */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">Joined</span>
          <span>01 Jan 2024</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">Status</span>
          <span className="text-green-600 font-semibold">Active</span>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
