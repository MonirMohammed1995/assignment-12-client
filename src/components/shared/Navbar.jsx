import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Menu } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthProvider';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const { user, logout, role, theme, setTheme } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const navLinks = (
    <>
      <NavLink to="/" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary transition"}>Home</NavLink>
      <NavLink to="/all-scholarships" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary transition"}>All Scholarships</NavLink>
      {user && role === 'user' && (
        <NavLink to="/dashboard/user" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary transition"}>Dashboard</NavLink>
      )}
      {user && role === 'admin' && (
        <NavLink to="/dashboard/admin" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary transition"}>Admin Panel</NavLink>
      )}
      {user && role === 'moderator' && (
        <NavLink to="/dashboard/moderator" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary transition"}>Moderator</NavLink>
      )}
    </>
  );

  const logoLink = user ? `/dashboard/${role}` : '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-base-100 shadow-md' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={logoLink} className="text-2xl font-bold text-primary flex items-center">
          <img src={logo} alt="Logo" className='w-12 mr-2' /> ScholarTrack
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-5 items-center text-sm">{navLinks}</div>
          <button onClick={toggleTheme} className="btn btn-ghost btn-sm">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <img src={user?.photoURL} alt="user avatar" className="w-8 h-8 rounded-full border shadow-sm" />
              <span className="text-sm font-medium">{user.displayName}</span>
              <button onClick={handleLogout} className="btn btn-sm btn-error text-white flex items-center gap-1">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary text-white">Login</Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <Menu size={22} />
          </label>
          <ul tabIndex={0} className="menu dropdown-content mt-3 z-[99] p-3 shadow bg-base-100 rounded-box w-52 space-y-1">
            {navLinks}
            <li><button onClick={toggleTheme}>{theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}</button></li>
            {user ? (
              <>
                <li className="text-sm font-semibold">{user.displayName}</li>
                <li><button onClick={handleLogout} className="btn btn-sm btn-error w-full">Logout</button></li>
              </>
            ) : (
              <li><Link to="/login" className="btn btn-sm btn-primary w-full">Login</Link></li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;