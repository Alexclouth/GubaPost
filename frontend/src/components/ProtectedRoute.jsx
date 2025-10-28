import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  allowedPermissions = [],
  requireSuperAdmin = false,
  children,
}) {
  const { user, isLoading, token } = useAuth();
  const location = useLocation();

  // ⏳ Wait while user data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // 🚫 Not logged in → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🧑‍💼 Super-admin only route
  if (requireSuperAdmin && user.role?.name !== "Super-admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Super-admin always has full access
  if (user.role?.name === "Super-admin") {
    return children;
  }

  // 🔐 If route requires certain permissions
  const userPermissions = user.role?.permissions || [];
  const hasPermission =
    allowedPermissions.length === 0 ||
    allowedPermissions.some((perm) => userPermissions.includes(perm));

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return children;
}
