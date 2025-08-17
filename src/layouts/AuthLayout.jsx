import React from 'react';
import { Outlet } from 'react-router-dom';
import loginImage from '../assets/images/login.jpg';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100">

      {/* Main Section */}
      <div className="flex flex-1 flex-col-reverse lg:flex-row justify-center items-center px-6 py-12 gap-12 max-w-7xl mx-auto">

        {/* Form Card */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transition-transform transform hover:-translate-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-6 text-center">
            Welcome Back
          </h2>
          <Outlet />
        </div>

        {/* Image Section */}
        <div className="w-full max-w-xl hidden lg:block">
          <img
            src={loginImage}
            alt="Login Visual"
            className="rounded-3xl shadow-xl w-full h-auto object-cover transition-transform transform hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
