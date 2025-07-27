import React from 'react';
import { NavLink } from 'react-router-dom';

// 🔗 Reusable Dashboard Link
export const DashboardLink = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block font-medium px-3 py-2 rounded-lg transition-all duration-150 ${
        isActive
          ? 'bg-indigo-600 text-white shadow'
          : 'hover:bg-indigo-100 text-gray-700 hover:text-indigo-600'
      }`
    }
    aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
  >
    {label}
  </NavLink>
);

// 👤 User Sidebar Links
export const UserSidebar = () => (
  <>
    <DashboardLink to="/dashboard/user" label="My Profile" />
    <DashboardLink to="/dashboard/user/my-applications" label="My Applications" />
    <DashboardLink to="/dashboard/user/my-reviews" label="My Reviews" />
  </>
);

// 👑 Admin Sidebar Links
export const AdminSidebar = () => (
  <>
    <DashboardLink to="/dashboard/admin" label="Admin Profile" />
    <DashboardLink to="/dashboard/admin/add-scholarship" label="Add Scholarship" />
    <DashboardLink to="/dashboard/admin/analytics-chart" label="Analytics Chart" />
    <DashboardLink to="/dashboard/admin/manage-users" label="Manage Users" />
    <DashboardLink to="/dashboard/admin/manage-scholarship" label="Manage Scholarships" />
    <DashboardLink to="/dashboard/admin/manage-applied-applications" label="Manage Applications" />
    <DashboardLink to="/dashboard/admin/manage-reviews" label="Manage Reviews" />
  </>
);

// 🧑‍🏫 Moderator Sidebar Links
export const ModeratorSidebar = () => (
  <>
    <DashboardLink to="/dashboard/moderator" label="Moderator Profile" />
    <DashboardLink to="/dashboard/moderator/add-scholarship" label="Add Scholarship" />
    <DashboardLink to="/dashboard/moderator/manage-scholarship" label="Manage Scholarships" />
    <DashboardLink to="/dashboard/moderator/all-reviews" label="All Reviews" />
    <DashboardLink to="/dashboard/moderator/all-applied-scholarship" label="All Applications" />
  </>
);
