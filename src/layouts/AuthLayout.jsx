import React from 'react';
import { Outlet } from 'react-router-dom';
import loginImage from '../assets/images/login.jpg';
import Navbar from '../components/shared/Navbar';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-blue-300">
      {/* Navbar */}
      <Navbar />

      {/* Main Section */}
      <div className="flex flex-1 flex-col-reverse lg:flex-row justify-center items-center px-4 py-10 gap-10">
        {/* Outlet Content (Form) */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mt-8">
          <Outlet />
        </div>

        {/* Image */}
        <div className="w-full max-w-xl">
          <img
            src={loginImage}
            alt="Login Visual"
            className="rounded-3xl shadow-lg w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;