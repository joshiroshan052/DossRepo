import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const AdminRoutes = () => {
  // Get user data
  const user = JSON.parse(localStorage.getItem('user'));

  if (user !== null && user.is_admin === 1) {
    // If user is logged in and is an admin, allow access
    return <Outlet />;
  } else {
    // If user is not logged in or is not an admin, redirect to login
    return <Navigate to="/login" />;
  }
};

export default AdminRoutes;
