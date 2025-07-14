// src/layout/DashboardLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // ✅ use the custom hook for safety
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

const DashboardLayout = () => {
  const { role, loading } = useAuth(); // Safe access to role and loading

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-xl font-semibold text-indigo-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <div className="flex min-h-screen bg-gray-100 mt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-indigo-700">Dashboard</h2>
        <nav className="space-y-3">
          {/* User Sidebar */}
          {role === 'user' && (
            <>
              <DashboardLink to="/dashboard/user" label="My Profile" />
              <DashboardLink to="/dashboard/user/applications" label="My Applications" />
              <DashboardLink to="/dashboard/user/reviews" label="My Reviews" />
            </>
          )}

          {/* Admin Sidebar */}
          {role === 'admin' && (
            <>
              <DashboardLink to="/dashboard/admin" label="Admin Panel" />
              <DashboardLink to="/dashboard/admin/users" label="Manage Users" />
              <DashboardLink to="/dashboard/admin/manage-scholarship" label="Manage Scholarships" />
              <DashboardLink to="/dashboard/admin/applications" label="Manage Applications" />
              <DashboardLink to="/dashboard/admin/analytics" label="Analytics" />
            </>
          )}

          {/* Moderator Sidebar */}
          {role === 'moderator' && (
            <>
              <DashboardLink to="/dashboard/moderator" label="Moderator Panel" />
              <DashboardLink to="/dashboard/moderator/manage-scholarships" label="Manage Scholarships" />
              <DashboardLink to="/dashboard/moderator/add-scholarship" label="Add Scholarship" />
              <DashboardLink to="/dashboard/moderator/reviews" label="All Reviews" />
              <DashboardLink to="/dashboard/moderator/applications" label="All Applications" />
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      
    </div>
    <Footer/>
    </div>
    
  );
};

export default DashboardLayout;

const DashboardLink = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block font-medium px-2 py-1 rounded ${
        isActive ? 'text-white bg-indigo-600' : 'text-gray-700 hover:text-indigo-600'
      }`
    }
  >
    {label}
  </NavLink>
);
