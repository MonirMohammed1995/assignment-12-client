import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthProvider';
import { ShieldCheck } from 'lucide-react';

const ModeratorProfile = () => {
  const { user, role } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-lg font-semibold text-gray-600">User not logged in.</p>
      </div>
    );
  }

  return (
    <section className="p-6 md:p-10">
      <div className="flex flex-col items-center gap-4 bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
        <img
          src={user.photoURL || 'https://i.ibb.co/5vTzJgM/avatar.png'}
          alt="User Avatar"
          className="w-32 h-32 rounded-full border-4 border-primary shadow-lg"
        />
        <h2 className="text-2xl font-bold text-center">{user?.displayName || 'No Name'}</h2>
        <p className="text-gray-500 text-sm">{user?.email}</p>

        {role !== 'user' && (
          <span className="flex items-center gap-1 mt-2 px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <ShieldCheck className="w-4 h-4" /> {role}
          </span>
        )}

        <p className="mt-4 text-sm text-gray-400">
          Joined: {user?.metadata?.creationTime
            ? new Date(user.metadata.creationTime).toLocaleDateString()
            : 'N/A'}
        </p>
      </div>
    </section>
  );
};

export default ModeratorProfile;
