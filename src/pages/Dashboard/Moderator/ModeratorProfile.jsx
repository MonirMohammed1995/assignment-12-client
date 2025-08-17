import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthProvider';
import { ShieldCheck } from 'lucide-react';

const ModeratorProfile = () => {
  const { user, role } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-lg font-semibold text-gray-600">User not logged in.</p>
      </div>
    );
  }

  return (
    <section className="p-6 md:p-10">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 transition-transform transform hover:scale-[1.02]">
        <div className="flex flex-col items-center gap-4">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={user.photoURL || 'https://i.ibb.co/5vTzJgM/avatar.png'}
              alt={user.displayName || 'Moderator profile'}
              className="w-32 h-32 rounded-full border-4 border-primary shadow-md object-cover"
            />
            {/* Active status indicator */}
            <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white bg-green-500 animate-pulse"></span>
          </div>

          {/* Name and Email */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.displayName || 'No Name'}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm mt-1 break-all">
              {user.email || 'No Email'}
            </p>

            {/* Role Badge */}
            {role && role !== 'user' && (
              <span className="inline-flex items-center gap-1 mt-2 px-4 py-1 bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white rounded-full text-sm font-semibold shadow-sm">
                <ShieldCheck className="w-4 h-4" /> {role.toUpperCase()}
              </span>
            )}

            {/* Joined Date */}
            <p className="mt-4 text-sm text-gray-400 dark:text-gray-300">
              Joined: {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>

          {/* Optional Stats (Industrial Feel) */}
          <div className="mt-6 grid grid-cols-3 gap-4 w-full text-center">
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
              <span className="block text-lg font-bold text-gray-900 dark:text-white">18</span>
              <span className="text-xs text-gray-500 dark:text-gray-300">Applications</span>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
              <span className="block text-lg font-bold text-gray-900 dark:text-white">9</span>
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

export default ModeratorProfile;
