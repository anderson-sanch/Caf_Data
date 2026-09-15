import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSessionRole, hasSession } from "../services/session";

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();

  if (!hasSession()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(getSessionRole())) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
