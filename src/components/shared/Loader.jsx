import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        <div className="absolute inset-2 border-4 border-blue-300 rounded-full animate-spin-slow border-b-transparent"></div>
      </div>
      <span className="ml-4 text-lg font-semibold text-blue-600 animate-pulse">Loading...</span>
    </div>
  );
};

export default Loader;
