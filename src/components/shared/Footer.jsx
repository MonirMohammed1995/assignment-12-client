import { Facebook, Linkedin, Twitter } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import { NavLink } from 'react-router-dom'; // ✅ Use NavLink for isActive

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content border-t">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Branding */}
        <div>
          <NavLink to='/' className='flex items-center gap-2'>
            <img src={logo} alt="Logo" className='w-10' />
            <span className='text-2xl font-bold text-blue-400'>
              Scholar<span className='text-purple-300'>Track</span>
            </span>
          </NavLink>
          <p className="text-sm mt-2 text-gray-600">
            Empowering students with the best scholarships globally.
          </p>
        </div>

        {/* Quick Links with isActive */}
        <div>
          <h3 className="footer-title text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="flex flex-col space-y-2 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium underline"
                  : "hover:text-blue-600 transition"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/all-scholarships"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium underline"
                  : "hover:text-blue-600 transition"
              }
            >
              All Scholarships
            </NavLink>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="footer-title text-lg font-semibold mb-2">Connect With Us</h3>
          <div className="flex gap-4 mt-2">
            <a href="#" className="btn btn-sm btn-circle btn-outline hover:bg-blue-100">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="btn btn-sm btn-circle btn-outline hover:bg-blue-100">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="btn btn-sm btn-circle btn-outline hover:bg-blue-100">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} ScholarTrack. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
