import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, requiredRoles = [] }) => {
  const { user } = useAuth();

  // Redirect to login if user is not logged in
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect to unauthorized if user does not have required roles
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the passed element if all conditions are met
  return element;
};


export default PrivateRoute;
