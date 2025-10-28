import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ProtectedRoute({
  allowedPermissions = [],
  requireSuperAdmin = false,
  children,
}) {
  const { user, isLoading, token } = useAuth();
  const location = useLocation();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && user && token) {
      let shouldRedirect = false;

      // 🧑‍💼 Require Super Admin
      if (requireSuperAdmin && user.role?.name !== "Super-admin") {
        toast.error("Access denied: Only Super Admins can view this page.");
        shouldRedirect = true;
      }

      // 🔐 Permission check
      const userPermissions = user.role?.permissions || [];
      const hasPermission =
        allowedPermissions.length === 0 ||
        allowedPermissions.some((perm) => userPermissions.includes(perm));

      if (!hasPermission && user.role?.name !== "Super-admin") {
        toast.error("Access denied: You do not have permission to access this page.");
        shouldRedirect = true;
      }

      if (shouldRedirect) {
        // delay redirect so toast can show
        const timeout = setTimeout(() => setRedirect(true), 2000);
        return () => clearTimeout(timeout); // cleanup if unmounted
      }
    }
  }, [user, token, isLoading, requireSuperAdmin, allowedPermissions]);

  // ⏳ Loading state
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

  // 🚀 Redirect after toast
  if (redirect) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // ✅ Authorized
  return children;
}
