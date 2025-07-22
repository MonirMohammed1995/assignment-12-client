import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthProvider';

const MyProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-6">
        <img
          src={user.photoURL || 'https://via.placeholder.com/96'}
          alt={`${user.displayName || 'User'} profile`}
          className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
        />
        <div className="mt-4 sm:mt-0 text-center sm:text-left">
          <h1 className="text-2xl font-semibold text-gray-900">{user.displayName || 'No Name Provided'}</h1>
          <p className="text-gray-600 mt-1">{user.email}</p>
          {user.role && user.role !== 'user' && (
            <p className="mt-2 inline-block px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full">
              Role: {user.role}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
