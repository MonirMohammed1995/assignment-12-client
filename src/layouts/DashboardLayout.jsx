// DashboardLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-200 p-4 space-y-4">
        <NavLink to="/dashboard/profile">My Profile</NavLink>
        <NavLink to="/dashboard/applications">My Applications</NavLink>
        <NavLink to="/dashboard/reviews">My Reviews</NavLink>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-indigo-50">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
