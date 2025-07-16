// src/routes/router.jsx
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

// Layouts
import Root from '../layouts/Root';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Error Pages
import PageNotFound from '../pages/Error/PageNotFound';
import Unauthorized from '../pages/Error/Unauthorized';

// Public Pages
import Home from '../pages/Home/Home';
import AllScholarships from '../pages/Scholarships/AllScholarships';
import ScholarshipDetails from '../pages/Scholarships/ScholarshipDetails';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// User Dashboard Pages
import MyProfile from '../pages/Dashboard/User/MyProfile';
import MyApplications from '../pages/Dashboard/User/MyApplications';
import MyReviews from '../pages/Dashboard/User/MyReviews';

// Admin Dashboard Pages
import AdminProfile from '../pages/Dashboard/Admin/AdminProfile';
import AddScholarship from '../pages/Dashboard/Admin/AddScholarship';
import ManageScholarship from '../pages/Dashboard/Admin/ManageScholarship';
import ManageAppliedApplication from '../pages/Dashboard/Admin/ManageAppliedApplication';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import ManageReviews from '../pages/Dashboard/Admin/ManageReviews';

// Moderator Dashboard Pages
import ModeratorProfile from '../pages/Dashboard/Moderator/ModeratorProfile';
import AddScholarshipModerator from '../pages/Dashboard/Moderator/AddScholarships'; // renamed for clarity
import ManageScholarshipsModerator from '../pages/Dashboard/Moderator/ManageScholarships';
import AllReviews from '../pages/Dashboard/Moderator/AllReviews';
import AllAppliedScholarships from '../pages/Dashboard/Moderator/AllAppliedScholarships';

// Route Guards
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import ModeratorRoute from './ModeratorRoute';

// Role-Based Redirect Page
import DashboardRedirect from '../pages/Dashboard/DashboardRedirect';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <PageNotFound />,
    children: [
      // Public Routes
      { index: true, element: <Home /> },
      { path: 'all-scholarships', element: <AllScholarships /> },
      { path: 'scholarship-details/:id', element: <ScholarshipDetails /> },

      // Auth Routes
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
        ],
      },

      // Unauthorized Route
      { path: 'unauthorized', element: <Unauthorized /> },

      // Dashboard Routes — Protected by PrivateRoute
      {
        path: 'dashboard',
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          // Redirect dashboard base to role-based dashboard
          { index: true, element: <DashboardRedirect /> },

          // User Dashboard Routes
          {
            path: 'user',
            children: [
              { index: true, element: <MyProfile /> },
              { path: 'my-applications', element: <MyApplications /> },
              { path: 'my-reviews', element: <MyReviews /> },
            ],
          },

          // Admin Dashboard Routes
          {
            path: 'admin',
            element: (
              <AdminRoute>
                <Outlet />
              </AdminRoute>
            ),
            children: [
              { index: true, element: <AdminProfile /> },
              { path: 'add-scholarship', element: <AddScholarship /> },
              { path: 'manage-scholarship', element: <ManageScholarship /> },
              { path: 'manage-applied-applications', element: <ManageAppliedApplication /> },
              { path: 'manage-users', element: <ManageUsers /> },
              { path: 'manage-reviews', element: <ManageReviews /> },
            ],
          },

          // Moderator Dashboard Routes
          {
            path: 'moderator',
            element: (
              <ModeratorRoute>
                <Outlet />
              </ModeratorRoute>
            ),
            children: [
              { index: true, element: <ModeratorProfile /> },
              { path: 'add-scholarship', element: <AddScholarshipModerator /> },
              { path: 'manage-scholarship', element: <ManageScholarshipsModerator /> },
              { path: 'all-reviews', element: <AllReviews /> },
              { path: 'all-applied-scholarship', element: <AllAppliedScholarships /> },
            ],
          },
        ],
      },
    ],
  },

  // Fallback Route for 404 or unmatched URLs
  { path: '*', element: <Navigate to="/" replace /> },
]);