export function normalizeRole(role) {
  const value = String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");

  if (["super admin", "superadmin", "root super admin"].includes(value)) return "SuperAdmin";
  if (["admin", "admin dashboard", "admindashboard"].includes(value)) return "Admin";
  if (["hr", "human resources"].includes(value)) return "HR";
  if (["manager"].includes(value)) return "Manager";
  if (["employee", "user"].includes(value)) return "Employee";

  return role || "";
}

export function getHomeRouteForRole(role) {
  switch (normalizeRole(role)) {
    case "SuperAdmin":
      return "/superadmin-dashboard";
    case "Admin":
      return "/admin-dashboard";
    case "HR":
      return "/hr-dashboard";
    case "Manager":
      return "/manager-dashboard";
    case "Employee":
      return "/employee-dashboard";
    default:
      return "/employee-dashboard";
  }
}

export function roleMatchesRoute(role, allowedRoles = []) {
  if (!allowedRoles.length) return true;
  return allowedRoles.map(normalizeRole).includes(normalizeRole(role));
}
