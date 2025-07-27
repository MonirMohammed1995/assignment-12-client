// src/routes/router.js
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

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

// Auth Pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// User Dashboard
import MyProfile from '../pages/Dashboard/User/MyProfile';
import MyApplications from '../pages/Dashboard/User/MyApplications';
import MyReviews from '../pages/Dashboard/User/MyReviews';

// Admin Dashboard
import AdminProfile from '../pages/Dashboard/Admin/AdminProfile';
import AddScholarship from '../pages/Dashboard/Admin/AddScholarship';
import ManageScholarship from '../pages/Dashboard/Admin/ManageScholarship';
import ManageAppliedApplication from '../pages/Dashboard/Admin/ManageAppliedApplication';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import ManageReviews from '../pages/Dashboard/Admin/ManageReviews';

// Moderator Dashboard
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

// Payment Pages
import Checkout from '../pages/Payment/Checkout';
import PaymentSuccess from '../pages/Payment/PaymentSuccess';

// Role-based redirect
import DashboardRedirect from '../pages/Dashboard/DashboardRedirect';

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <PageNotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'all-scholarships', element: <AllScholarships /> },
      { path: 'scholarships/:id', element: <ScholarshipDetails /> },

      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
        ],
      },

      // ✅ Payment routes
      {
        path: 'checkout/:id',
        element: (
          <PrivateRoute>
            <UserRoute>
              <Elements stripe={stripePromise}>
                <Checkout />
              </Elements>
            </UserRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'payment-success',
        element: (
          <PrivateRoute>
            <UserRoute>
              <PaymentSuccess />
            </UserRoute>
          </PrivateRoute>
        ),
      },

      { path: 'unauthorized', element: <Unauthorized /> },

      // ✅ Dashboard
      {
        path: 'dashboard',
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <DashboardRedirect /> },

          {
            path: 'user',
            element: <UserRoute><Outlet /></UserRoute>,
            children: [
              { index: true, element: <MyProfile /> },
              { path: 'my-applications', element: <MyApplications /> },
              { path: 'my-reviews', element: <MyReviews /> },
            ],
          },

          {
            path: 'admin',
            element: <AdminRoute><Outlet /></AdminRoute>,
            children: [
              { index: true, element: <AdminProfile /> },
              { path: 'add-scholarship', element: <AddScholarship /> },
              { path: 'manage-scholarship', element: <ManageScholarship /> },
              { path: 'manage-applied-applications', element: <ManageAppliedApplication /> },
              { path: 'manage-users', element: <ManageUsers /> },
              { path: 'manage-reviews', element: <ManageReviews /> },
            ],
          },

          {
            path: 'moderator',
            element: <ModeratorRoute><Outlet /></ModeratorRoute>,
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
]);
