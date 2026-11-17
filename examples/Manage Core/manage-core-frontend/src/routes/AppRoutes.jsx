import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import ProtectedRoute from "./ProtectedRoute";
import { getHomeRouteForRole } from "../utils/roles";
import Loading from "../pages/loading/Loading";
import ErrorScreen from "../pages/error/ErrorScreen";

const Login = lazy(() => import("../pages/auth/Login"));
const AdminDashboard = lazy(() => import("../pages/dashboards/AdminDashboard"));
const HRDashboard = lazy(() => import("../pages/dashboards/HRDashboard"));
const ManagerDashboard = lazy(() => import("../pages/dashboards/ManagerDashboard"));
const EmployeeDashboard = lazy(() => import("../pages/dashboards/EmployeeDashboard"));
const AddRole = lazy(() => import("../pages/Permissions&Modules/AddRole"));
const RoleProfile = lazy(() => import("../pages/Permissions&Modules/RoleProfile"));
const SuperAdminDashboard = lazy(() => import("../pages/superadmin/SuperAdminDashboard"));
const ModuleManagementCenter = lazy(() => import("../pages/superadmin/ModuleManagement/ModuleManagementCenter"));
const PublicInvoiceView = lazy(() => import("../pages/public/PublicInvoiceView"));
const PublicSharedView = lazy(() => import("../pages/public/PublicSharedView"));

const Fallback = () => <Loading />;

const AppRoutes = () => {
  const { authLoading, currentUser } = useApp();
  const location = useLocation();

  const isPublicRoute = location.pathname.startsWith("/public/");
  if (authLoading && !isPublicRoute) {
    return <Loading />;
  }

  const homeRoute = currentUser ? getHomeRouteForRole(currentUser.role) : "/login";

  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {/* Public (no auth) routes */}
        <Route path="/public/invoice/:token" element={<PublicInvoiceView />} />
        <Route path="/public/invoices/:token" element={<PublicInvoiceView />} />
        <Route path="/public/share/:entityType/:token" element={<PublicSharedView />} />

        <Route path="/" element={<Navigate to={homeRoute} replace />} />
        <Route path="/app" element={<Navigate to={homeRoute} replace />} />
        <Route path="/home" element={<Navigate to={homeRoute} replace />} />

        <Route path="/login" element={currentUser ? <Navigate to={homeRoute} replace /> : <Login />} />
        <Route path="/superadmin-dashboard" element={<ProtectedRoute allowedRoles={["SuperAdmin"]}><SuperAdminDashboard /></ProtectedRoute>} />
        <Route path="/superadmin/modules" element={<ProtectedRoute allowedRoles={["SuperAdmin"]}><ModuleManagementCenter /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/hr-dashboard" element={<ProtectedRoute allowedRoles={["Admin", "HR"]}><HRDashboard /></ProtectedRoute>} />
        <Route path="/manager-dashboard" element={<ProtectedRoute allowedRoles={["Admin", "Manager"]}><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/employee-dashboard" element={<ProtectedRoute allowedRoles={[]}><EmployeeDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard/roles/add" element={<ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}><AddRole /></ProtectedRoute>} />
        <Route path="/admin-dashboard/roles/edit/:id" element={<ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}><AddRole /></ProtectedRoute>} />
        <Route path="/admin-dashboard/roles/view/:id" element={<ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}><RoleProfile /></ProtectedRoute>} />

        <Route path="*" element={<ErrorScreen variant="404" homePath={homeRoute} />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;