import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-16">
      <div className="max-w-xl text-center">
        {/* Error Icon */}
        <svg
          className="mx-auto mb-6 h-24 w-24 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3m0 3h.01M21 12c0 4.9706-4.0294 9-9 9s-9-4.0294-9-9 4.0294-9 9-9 9 4.0294 9 9z"
          />
        </svg>

        {/* Heading */}
        <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>

        {/* Message */}
        <p className="text-gray-500 mb-8">
          Oops! The page you are looking for might have been removed or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-300"
            aria-label="Go back to homepage"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition duration-300"
            aria-label="Go to previous page"
          >
            Previous Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
