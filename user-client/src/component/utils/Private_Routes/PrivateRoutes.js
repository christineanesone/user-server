import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoutes = () => {
  const user = useSelector((state) => state.auth.user)

  // Check if user is authenticated and an admin
  if (user) {
    return <Outlet />;
  } else if (user) {
    // Redirect non-admin users to an unauthorised page
    return <Navigate to="/sign-in" />;
  } else {
    // Redirect unauthenticated users to the sign-in page
    return <Navigate to="/sign-in" />;
  }
};

export default PrivateRoutes;
