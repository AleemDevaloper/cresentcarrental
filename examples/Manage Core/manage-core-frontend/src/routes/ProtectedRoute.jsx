import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";
import Loading from "../pages/loading/Loading";
import ErrorScreen from "../pages/error/ErrorScreen";
import { getHomeRouteForRole, roleMatchesRoute } from "../utils/roles";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, authLoading } = useApp();

  if (authLoading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!roleMatchesRoute(currentUser.role, allowedRoles)) {
    const homeRoute = getHomeRouteForRole(currentUser.role);
    return <ErrorScreen variant="403" homePath={homeRoute} />;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

export default ProtectedRoute;
