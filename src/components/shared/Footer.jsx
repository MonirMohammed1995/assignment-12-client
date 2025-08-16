import { Facebook, Linkedin, Twitter } from "lucide-react";
import logo from "../../assets/images/logo.png";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const linkClasses = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-medium underline underline-offset-4"
      : "hover:text-blue-500 transition-colors duration-200";

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t mt-16">
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Branding Section */}
        <div className="space-y-4">
          <NavLink to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-14 h-14 object-contain" />
            <span className="text-2xl font-bold text-gradient bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Scholar<span className="text-indigo-600">Track</span>
            </span>
          </NavLink>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Empowering students with global scholarship opportunities, connecting talent with possibilities.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Quick Links</h3>
          <ul className="flex flex-col space-y-2 text-sm">
            <NavLink to="/" className={linkClasses}>Home</NavLink>
            <NavLink to="/all-scholarships" className={linkClasses}>All Scholarships</NavLink>
            <NavLink to="/contact" className={linkClasses}>Contact Us</NavLink>
            <NavLink to="/about-us" className={linkClasses}>About</NavLink>
          </ul>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Connect With Us</h3>
          <div className="flex gap-4 mt-2">
            <a href="#" aria-label="Facebook" className="btn btn-sm btn-circle btn-outline hover:bg-blue-500 hover:text-white transition-all duration-200 hover:scale-110 shadow-md">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="btn btn-sm btn-circle btn-outline hover:bg-blue-700 hover:text-white transition-all duration-200 hover:scale-110 shadow-md">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Twitter" className="btn btn-sm btn-circle btn-outline hover:bg-sky-500 hover:text-white transition-all duration-200 hover:scale-110 shadow-md">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright & Credit */}
      <div className="bg-gray-100 dark:bg-gray-800 border-t">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} ScholarTrack. All rights reserved.</p>
          <p>
            Designed with <span className="text-red-500"></span> by ScholarTrack Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
