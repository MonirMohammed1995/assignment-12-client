import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon, Menu } from "lucide-react";
import toast from "react-hot-toast";
import logo from "../../assets/images/logo.png";
import { AuthContext } from "../../context/AuthProvider";

const Navbar = () => {
  const { user, logout, role, theme, setTheme } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sticky navbar effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme handling
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/");
      setDropdownOpen(false);
    } catch {
      toast.error("Logout failed");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const dashboardLink =
    role === "admin"
      ? "/dashboard/admin"
      : role === "moderator"
      ? "/dashboard/moderator"
      : "/dashboard";

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about-us", label: "About"},
    { path: "/contact", label: "Contacts"},
    { path: "/all-scholarships", label: "All Scholarships" },
  ];

  if (user) {
    navItems.push({
      path: dashboardLink,
      label:
        role === "admin"
          ? "Admin Panel"
          : role === "moderator"
          ? "Moderator Panel"
          : "Dashboard",
    });
  }

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-500 text-white shadow-sm"
        : "text-gray-700 dark:text-gray-200 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-base-100/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={user ? dashboardLink : "/"}
          className="flex items-center gap-2 font-bold text-xl text-blue-500"
        >
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span>
            Scholar<span className="text-purple-400">Track</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} className={linkClasses}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Auth Section */}
          {user ? (
            <div className="relative group">
              <img
                src={user?.photoURL || "/default-avatar.png"}
                alt={user.displayName || "User"}
                className="w-9 h-9 rounded-full border object-cover cursor-pointer"
              />
              <div className="absolute right-0 mt-2 w-40 bg-base-100 shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-200">
                <div className="p-3 border-b">
                  <p className="text-sm font-semibold truncate">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="btn btn-sm bg-blue-500 hover:bg-blue-600 border-none text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-sm bg-purple-500 hover:bg-purple-600 border-none text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="btn btn-ghost btn-circle"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {dropdownOpen && (
        <div className="md:hidden bg-base-100 shadow-lg">
          <ul className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={linkClasses}
                  onClick={() => setDropdownOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                onClick={toggleTheme}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </button>
            </li>
            {user ? (
              <>
                <li className="px-3 py-1 text-sm font-semibold">
                  {user.displayName}
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-error w-full text-white"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="btn btn-sm bg-blue-500 text-white w-full"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="btn btn-sm bg-purple-500 text-white w-full"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
