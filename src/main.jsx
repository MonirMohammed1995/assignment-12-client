// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import AuthProvider from './context/AuthProvider';
import { Toaster } from 'react-hot-toast'; // ✅ If using toast or react-hot-toast

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} /> {/* ✅ Global Toasts */}
    </AuthProvider>
  </React.StrictMode>
);
