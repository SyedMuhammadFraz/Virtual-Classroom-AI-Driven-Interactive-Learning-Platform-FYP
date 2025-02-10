import React from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const getUserRole = () => {
  return localStorage.getItem("role"); // Get user role
};

const PrivateRoute = ({ element, requiredRole }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" />;
  }

  const userRole = getUserRole();

  // Redirect users based on role
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === "admin" ? "/admin" : "/dashboard"} />;
  }

  return element;
};

export default PrivateRoute;
