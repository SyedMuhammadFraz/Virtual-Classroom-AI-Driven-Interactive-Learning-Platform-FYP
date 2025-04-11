import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ element }) => {
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (accessToken && role === "student") {
    return <Navigate to="/dashboard" />;
  }

  if (accessToken && role === "admin") {
    return <Navigate to="/admin" />;
  }

  return element;
};

export default PublicRoute;

