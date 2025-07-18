import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Menu } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../assets/images/logo.png';
import { AuthContext } from '../../context/AuthProvider';

const Navbar = () => {
  const { user, logout, role, theme, setTheme } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      navigate('/');
      setDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const dashboardLink =
    role === 'admin'
      ? '/dashboard/admin'
      : role === 'moderator'
      ? '/dashboard/moderator'
      : '/dashboard';

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'text-white bg-blue-400 font-semibold p-2 px-2 rounded-lg block'
              : 'hover:text-blue-400 transition block'
          }
          onClick={() => setDropdownOpen(false)}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/all-scholarships"
          className={({ isActive }) =>
            isActive
              ? 'text-white bg-blue-400 font-semibold p-2 px-2 rounded-lg block'
              : 'hover:text-blue-400 transition block'
          }
          onClick={() => setDropdownOpen(false)}
        >
          All Scholarships
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to={dashboardLink}
            className={({ isActive }) =>
              isActive
                ? 'text-white bg-blue-400 font-semibold p-2 px-2 rounded-lg block'
                : 'hover:text-blue-400 transition block'
            }
            onClick={() => setDropdownOpen(false)}
          >
            {role === 'admin'
              ? 'Admin Panel'
              : role === 'moderator'
              ? 'Moderator Panel'
              : 'Dashboard'}
          </NavLink>
        </li>
      )}
    </>
  );

  const logoLink = user ? dashboardLink : '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-base-100 shadow-md' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to={logoLink}
          className="text-2xl font-bold text-primary flex items-center"
          onClick={() => setDropdownOpen(false)}
        >
          <img src={logo} alt="Logo" className="w-12 mr-2" />
          <span className="text-blue-400">
            Scholar<span className="text-purple-300">Track</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-3 items-center text-sm list-none m-0 p-0">{navLinks}</ul>
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user?.photoURL || '/default-avatar.png'}
                alt={user.displayName || 'User avatar'}
                title={user.email || ''}
                className="w-8 h-8 rounded-full border shadow-sm object-cover"
              />
              <span className="text-sm font-medium">{user.displayName}</span>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-error text-white flex items-center gap-1"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="btn btn-md shadow-md bg-blue-400 hover:bg-blue-500 border-none text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-md shadow-md bg-purple-400 hover:bg-purple-500 border-none text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden relative">
          <button
            aria-label="Toggle menu"
            aria-expanded={dropdownOpen}
            onClick={toggleDropdown}
            className="btn btn-ghost btn-circle"
          >
            <Menu size={22} />
          </button>
          {dropdownOpen && (
            <ul
              className="menu dropdown-content mt-3 z-[99] p-3 shadow bg-base-100 rounded-box w-52 space-y-1 absolute right-0"
              onClick={() => setDropdownOpen(false)} // close on any click inside menu
            >
              {navLinks}
              <li>
                <button onClick={toggleTheme} className="w-full text-left">
                  {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
              </li>
              {user ? (
                <>
                  <li className="text-sm font-semibold">{user.displayName}</li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="btn btn-sm btn-error w-full"
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
                      className="btn btn-md shadow-md bg-blue-400 text-white hover:bg-blue-500 w-full"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="btn btn-md shadow-md bg-purple-400 text-white hover:bg-purple-500 w-full"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
