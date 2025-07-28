import React from "react";
import { Helmet } from "react-helmet";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <Helmet><title>UnAuthorized</title></Helmet>
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700">
        You are not authorized to view this page. Please login with an
        appropriate role.
      </p>
    </div>
  );
};

export default Unauthorized;
