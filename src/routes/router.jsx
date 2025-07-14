import { createBrowserRouter } from 'react-router-dom';

// Layouts
import Root from '../layouts/Root';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public pages
import PageNotFound from '../pages/Error/PageNotFound';
import Home from '../pages/Home/Home';
import AllScholarship from '../pages/Scholarships/AllScholarships';
import ScholarshipDetails from '../pages/Scholarships/ScholarshipDetails';

// Auth pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// USER dashboard pages
import MyProfile from '../pages/Dashboard/User/MyProfile';
import MyApplications from '../pages/Dashboard/User/MyApplications';
import MyReviews from '../pages/Dashboard/User/MyReviews';

// ADMIN dashboard pages
import AdminDashboard from '../pages/Dashboard/Admin/AdminDashboard';
import AddScholarship from '../pages/Dashboard/Admin/AddScholarship';
import ManageScholarships from '../pages/Dashboard/Admin/ManageScholarships'; // ✅ fixed here
import ManageApplications from '../pages/Dashboard/Admin/ManageApplications';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';

// MODERATOR dashboard pages
import ModeratorDashboard from '../pages/Dashboard/Moderator/ModeratorDashboard';
import ModeratorAddScholarship from '../pages/Dashboard/Moderator/ModeratorAddScholarship';
import ManageModeratorScholarships from '../pages/Dashboard/Moderator/ManageScholarships';
import AllReviews from '../pages/Dashboard/Moderator/AllReviews';
import AllApplications from '../pages/Dashboard/Moderator/AllApplications';

// Route guards
import PrivateRoute from '../routes/PrivateRoute';
import AdminRoute from '../routes/AdminRoute';
import ModeratorRoute from '../routes/ModeratorRoute';

export const router = createBrowserRouter([
  // 🌐 PUBLIC ROUTES
  {
    path: '/',
    element: <Root />,
    errorElement: <PageNotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'all-scholarships', element: <AllScholarship /> },
      {
        path: 'scholarships/:id',
        element: (
          <PrivateRoute>
            <ScholarshipDetails />
          </PrivateRoute>
        ),
      },
    ],
  },

  // 🔒 AUTH ROUTES
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },

  // 🔐 USER DASHBOARD
  {
    path: 'dashboard/user',
    element: (
      <PrivateRoute role="user">
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <MyProfile /> },
      { path: 'applications', element: <MyApplications /> },
      { path: 'reviews', element: <MyReviews /> },
    ],
  },

  // 🔐 ADMIN DASHBOARD
  {
    path: 'dashboard/admin',
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <ManageUsers /> },
      { path: 'add-scholarship', element: <AddScholarship /> },
      { path: 'manage-scholarship', element: <ManageScholarships /> }, // ✅ fixed route name
      { path: 'manage-applications', element: <ManageApplications /> },
    ],
  },

  // 🔐 MODERATOR DASHBOARD
  {
    path: 'dashboard/moderator',
    element: (
      <ModeratorRoute>
        <DashboardLayout />
      </ModeratorRoute>
    ),
    children: [
      { index: true, element: <ModeratorDashboard /> },
      { path: 'manage-scholarships', element: <ManageModeratorScholarships /> },
      { path: 'add-scholarship', element: <ModeratorAddScholarship /> },
      { path: 'reviews', element: <AllReviews /> },
      { path: 'all-applications', element: <AllApplications /> },
    ],
  },
]);
