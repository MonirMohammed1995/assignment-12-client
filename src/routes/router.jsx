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
import AddScholarshipModerator from '../pages/Dashboard/Moderator/AddScholarships';
import ManageScholarshipsModerator from '../pages/Dashboard/Moderator/ManageScholarships';
import AllReviews from '../pages/Dashboard/Moderator/AllReviews';
import AllAppliedScholarships from '../pages/Dashboard/Moderator/AllAppliedScholarships';

// Route Guards
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import ModeratorRoute from './ModeratorRoute';
import UserRoute from './UserRoute';

// Dashboard Redirect (based on role)
import DashboardRedirect from '../pages/Dashboard/DashboardRedirect';

// Payment Pages
import Checkout from '../pages/Payment/Checkout';
import PaymentSuccess from '../pages/Payment/PaymentSuccess';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <PageNotFound />,
    children: [
      // ✅ Public Routes
      { index: true, element: <Home /> },
      { path: 'all-scholarships', element: <AllScholarships /> },
      { path: 'scholarship-details/:id', element: <ScholarshipDetails /> },

      // ✅ Auth Routes (Nested under AuthLayout)
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
        ],
      },

      // ✅ Payment Routes (Only for User Role)
      {
        path: 'checkout/:id',
        element: (
          <PrivateRoute>
            <UserRoute>
              <Checkout />
            </UserRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'payment-success/:tranId',
        element: (
          <PrivateRoute>
            <UserRoute>
              <PaymentSuccess />
            </UserRoute>
          </PrivateRoute>
        ),
      },

      // 🚫 Unauthorized
      { path: '/unauthorized', element: <Unauthorized /> },

      // ✅ Protected Dashboard
      {
        path: 'dashboard',
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          // 🔁 Redirect based on Role
          { index: true, element: <DashboardRedirect /> },

          // 👤 User Dashboard
          {
            path: 'user',
            element: (
              <UserRoute>
                <Outlet />
              </UserRoute>
            ),
            children: [
              { index: true, element: <MyProfile /> },
              { path: 'my-applications', element: <MyApplications /> },
              { path: 'my-reviews', element: <MyReviews /> },
            ],
          },

          // 🛡 Admin Dashboard
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

          // 🧰 Moderator Dashboard
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

  // 🌐 Global Fallback
  { path: '*', element: <Navigate to="/" replace /> },
]);
