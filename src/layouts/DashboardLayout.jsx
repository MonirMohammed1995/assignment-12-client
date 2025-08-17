import { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { LogOut, Menu, X } from "lucide-react";
import Swal from "sweetalert2";
import {
  AdminSidebar,
  ModeratorSidebar,
  UserSidebar,
} from "../components/shared/DashboardLink";
import { Helmet } from "react-helmet";

const DashboardLayout = () => {
  const { user, role, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <span className="text-xl font-semibold text-indigo-600 animate-pulse">
          Loading dashboard...
        </span>
      </div>
    );
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
    });

    if (result.isConfirmed) {
      await logout();
      Swal.fire("Logged Out", "You have been successfully logged out.", "success");
      navigate("/");
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      {/* ===== Topbar ===== */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-4 md:px-8 z-20 ">
        <h1 className="text-lg md:text-xl font-bold text-indigo-600 tracking-tight">
          {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard` : "Dashboard"}
        </h1>

        <div className="flex items-center gap-4">
          <p className="hidden md:block text-sm text-gray-500">
            {user?.displayName || "User"}
          </p>
          <img
            src={user?.photoURL || "https://i.ibb.co/2M7tV5Z/avatar.png"}
            alt="avatar"
            className="w-9 h-9 rounded-full border shadow-sm"
          />
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* ===== Sidebar ===== */}
        <aside
          className={`fixed md:static top-16 left-0 w-64 bg-white/90 backdrop-blur-lg shadow-lg transition-transform transform 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 z-10 h-[calc(100vh-64px)] overflow-y-auto`}
        >
          {/* User Info */}
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-3">
              <img
                src={user?.photoURL || "https://i.ibb.co/2M7tV5Z/avatar.png"}
                alt="User Avatar"
                className="w-12 h-12 rounded-full border border-indigo-300 shadow"
              />
              <div>
                <p className="font-semibold">{user?.displayName || "User"}</p>
                <p className="text-sm capitalize text-gray-500">{role}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Sidebar */}
          <nav className="p-4 space-y-2">{Sidebar}</nav>

          {/* Logout */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 transition shadow-sm"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* ===== Main Content ===== */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md p-6 min-h-[calc(100vh-80px)] border border-gray-100">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
