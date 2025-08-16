import { Facebook, Linkedin, Twitter } from "lucide-react";
import logo from "../../assets/images/logo.png";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const linkClasses = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-medium underline underline-offset-4"
      : "hover:text-blue-500 transition-colors duration-200";

  return (
    <footer className="bg-base-200 text-base-content border-t mt-10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Branding Section */}
        <div>
          <NavLink to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-blue-500">
              Scholar<span className="text-purple-400">Track</span>
            </span>
          </NavLink>
          <p className="text-sm mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            Empowering students with global scholarship opportunities, connecting talent with possibilities.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="flex flex-col space-y-2 text-sm">
            <NavLink to="/" className={linkClasses}>
              Home
            </NavLink>
            <NavLink to="/all-scholarships" className={linkClasses}>
              All Scholarships
            </NavLink>
            <NavLink to="/contact" className={linkClasses}>
              Contact Us
            </NavLink>
            <NavLink to="/about-us" className={linkClasses}>
              About
            </NavLink>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
          <div className="flex gap-4 mt-2">
            <a
              href="#"
              aria-label="Facebook"
              className="btn btn-sm btn-circle btn-outline hover:bg-blue-500 hover:text-white transition-all duration-200 hover:scale-110"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="btn btn-sm btn-circle btn-outline hover:bg-blue-700 hover:text-white transition-all duration-200 hover:scale-110"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="btn btn-sm btn-circle btn-outline hover:bg-sky-500 hover:text-white transition-all duration-200 hover:scale-110"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-base-300 border-t">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ScholarTrack. All rights reserved.</p>
          <p>
            Designed with <span className="text-red-500">❤</span> by ScholarTrack Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
