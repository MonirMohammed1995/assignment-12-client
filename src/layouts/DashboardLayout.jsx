import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import { LogOut } from 'lucide-react';
import Swal from 'sweetalert2';
import { AdminSidebar, ModeratorSidebar, UserSidebar } from '../components/shared/DashboardLink';
import { Helmet } from 'react-helmet';

const DashboardLayout = () => {
  const { user, role, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-xl font-semibold text-indigo-600 animate-pulse">
          Loading dashboard...
        </span>
      </div>
    );
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
    });

    if (result.isConfirmed) {
      await logout();
      Swal.fire('Logged Out', 'You have been successfully logged out.', 'success');
      navigate('/');
    }
  };

  // Role-based sidebar mapping
  const sidebarComponents = {
    user: <UserSidebar />,
    admin: <AdminSidebar />,
    moderator: <ModeratorSidebar />,
  };

  const Sidebar = sidebarComponents[role] || null;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet><title>Dashboard</title></Helmet>
      <div className="flex flex-1 bg-gray-50 mt-20 min-h-[calc(100vh-80px)] text-gray-700">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 hidden md:block sticky top-20 self-start h-[calc(100vh-80px)] overflow-y-auto rounded-tr-2xl">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src={user?.photoURL || 'https://i.ibb.co/2M7tV5Z/avatar.png'}
              alt="User Avatar"
              className="w-12 h-12 rounded-full border border-indigo-300"
            />
            <div>
              <p className="font-semibold">{user?.displayName || 'User'}</p>
              <p className="text-sm capitalize text-gray-500">{role}</p>
            </div>
          </div>

          <hr className="mb-6" />

          {/* Dynamic Sidebar Based on Role */}
          <nav className="space-y-3" aria-label={`${role} Navigation`}>
            {Sidebar}
          </nav>

          <hr className="my-6" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
