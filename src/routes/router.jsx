// src/routes/router.js
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// === Layouts ===
import Root from '../layouts/Root';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// === Error Pages ===
import PageNotFound from '../pages/Error/PageNotFound';
import Unauthorized from '../pages/Error/Unauthorized';

// === Public Pages ===
import Home from '../pages/Home/Home';
import AllScholarships from '../pages/Scholarships/AllScholarships';
import ScholarshipDetails from '../pages/Scholarships/ScholarshipDetails';

// === Auth Pages ===
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// === User Dashboard ===
import MyProfile from '../pages/Dashboard/User/MyProfile';
import MyApplications from '../pages/Dashboard/User/MyApplications';
import MyReviews from '../pages/Dashboard/User/MyReviews';

// === Admin Dashboard ===
import AdminProfile from '../pages/Dashboard/Admin/AdminProfile';
import AddScholarship from '../pages/Dashboard/Admin/AddScholarship';
import ManageScholarship from '../pages/Dashboard/Admin/ManageScholarship';
import ManageAppliedApplication from '../pages/Dashboard/Admin/ManageAppliedApplication';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import ManageReviews from '../pages/Dashboard/Admin/ManageReviews';
import AnalyticsChart from '../pages/Dashboard/Admin/AnalyticsChart';

// === Moderator Dashboard ===
import ModeratorProfile from '../pages/Dashboard/Moderator/ModeratorProfile';
import AddScholarshipModerator from '../pages/Dashboard/Moderator/AddScholarships';
import ManageScholarshipsModerator from '../pages/Dashboard/Moderator/ManageScholarships';
import AllReviews from '../pages/Dashboard/Moderator/AllReviews';
import AllAppliedScholarships from '../pages/Dashboard/Moderator/AllAppliedScholarships';

// === Payment Pages ===
import Checkout from '../pages/Payment/Checkout';
import PaymentSuccess from '../pages/Payment/PaymentSuccess';

// === Route Guards ===
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import ModeratorRoute from './ModeratorRoute';
import UserRoute from './UserRoute';

// === Redirect ===
import DashboardRedirect from '../pages/Dashboard/DashboardRedirect';
import AboutUs from '../pages/AboutUs';
import Contact from '../pages/Contact';

// === Stripe Setup ===
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);

// === Router Configuration ===
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <PageNotFound />,
    children: [
      // Public Pages
      { index: true, element: <Home /> },
      { path: "/about-us", element:<AboutUs/>},
      { path: "/contact", element:<Contact/>},
      { path: 'all-scholarships', element: <AllScholarships /> },
      { path: 'scholarships/:id', element: <ScholarshipDetails /> },

      // Auth Pages
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
        ],
      },

      // Payment Routes
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

      // Unauthorized Page
      { path: '/unauthorized', element: <Unauthorized /> },

      // Dashboard Layout with Role-Based Nested Routes
    ],
  },
  {
        path: 'dashboard',
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <DashboardRedirect /> },

          // User Dashboard
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

          // Admin Dashboard
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
              { path: 'analytics-chart', element: <AnalyticsChart /> },
              { path: 'manage-scholarship', element: <ManageScholarship /> },
              { path: 'manage-applied-app', element: <ManageAppliedApplication /> },
              { path: 'manage-users', element: <ManageUsers /> },
              { path: 'manage-reviews', element: <ManageReviews /> },
            ],
          },

          // Moderator Dashboard
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
              { path: 'all-applied-scholarships', element: <AllAppliedScholarships /> },
            ],
          },
        ],
      }
]);
