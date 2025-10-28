import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Users, Shield, FileText } from "lucide-react";

const permissionToLabel = {
  manage_users: "Manage Users",
  manage_roles: "Manage Roles",
  manage_posts: "Manage Posts",
  create_posts: "Create Post",
};

const permissionToRoute = {
  manage_users: "/manage-users",
  manage_roles: "/manage-roles",
  manage_posts: "/manage-posts",
  create_posts: "/create-post",
};

const permissionToIcon = {
  manage_users: <Users size={16} />,
  manage_roles: <Shield size={16} />,
  manage_posts: <FileText size={16} />,
  create_posts: <FileText size={16} />,
};

export default function Sidebar({ isOpen }) {
  const { user, refetchUser } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Refetch permissions every time sidebar is rendered
  refetchUser();

  const requiredAdminPerms = ["manage_users", "manage_roles", "manage_posts"];
  const hasAllRequiredPerms = requiredAdminPerms.every((perm) =>
    user.role?.permissions?.includes(perm)
  );
  const canAccessAdminDashboard = user.role?.name === "Super-admin" || hasAllRequiredPerms;

  const links = [
    { label: "Home", route: "/", icon: <Home size={16} /> },
    ...(canAccessAdminDashboard
      ? [{ label: "Admin Dashboard", route: "/super-admin", icon: <Shield size={16} /> }]
      : []),
    ...(user.role?.permissions?.map((perm) => ({
      label: permissionToLabel[perm] || perm,
      route: permissionToRoute[perm] || "/",
      icon: permissionToIcon[perm] || null,
    })) || []),
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 overflow-hidden ${
        isOpen ? "w-64" : "w-0"
      }`}
    >
      <div className={`flex flex-col h-full p-6 ${isOpen ? "opacity-100" : "opacity-0"}`}>
        <h1 className="text-2xl font-bold text-green-600 mb-8 transition-opacity">{isOpen && "Dashboard"}</h1>
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive = location.pathname === link.route;
            return (
              <Link
                key={link.route}
                to={link.route}
                className={`flex items-center gap-2 p-2 rounded-lg font-medium text-sm transition-colors duration-200
                  ${isActive ? "bg-green-600 text-white" : "text-gray-800 hover:bg-green-50"}
                `}
              >
                {link.icon}
                {isOpen && link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
