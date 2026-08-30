import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppState } from "../state/store";
import { dashboardPathForRole } from "../services/authService";
import { PATHS } from "./paths";

export function ProtectedRoute({ role, children }) {
  const { state } = useAppState();
  const location = useLocation();

  if (!state.isAuthenticated) {
    const loginPath = role === "partner" ? PATHS.partnerLogin : PATHS.momLogin;
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  if (role && state.userRole !== role) {
    return <Navigate to={dashboardPathForRole(state.userRole)} replace />;
  }

  return children;
}

export function GuestRoute({ children }) {
  const { state } = useAppState();
  if (state.isAuthenticated) {
    return <Navigate to={dashboardPathForRole(state.userRole)} replace />;
  }
  return children;
}
