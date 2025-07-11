import { Facebook, Linkedin, Twitter } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="footer max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Branding */}
        <div>
          <span className="text-xl font-bold flex items-center"><img src={logo} alt="Logo" className='w-12 mr-2'/> ScholarTrack</span>
          <p className="text-sm mt-2">Empowering students with the best scholarships globally.</p>
        </div>

        {/* Quick Links */}
        <div>
          <span className="footer-title">Quick Links</span>
          <a href="/" className="link link-hover">Home</a>
          <a href="/all-scholarships" className="link link-hover">All Scholarships</a>
        </div>

        {/* Socials */}
        <div>
          <span className="footer-title">Connect With Us</span>
          <div className="flex gap-4 mt-2">
            <a href="#" className="btn btn-sm btn-circle btn-outline">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="btn btn-sm btn-circle btn-outline">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="btn btn-sm btn-circle btn-outline">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-sm py-4 border-t">
        © {new Date().getFullYear()} ScholarTrack. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;