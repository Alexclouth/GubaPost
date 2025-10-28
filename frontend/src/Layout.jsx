import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageRoles from "./pages/ManageRoles";
import ManagePosts from "./pages/ManagePosts";
import CreatePost from "./pages/CreatePost";
import Account from "./pages/Account";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function Layout() {
  const { user } = useAuth();
  const userPermissions = user?.role?.permissions || [];
  const roleName = user?.role?.name;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = roleName !== "User" && userPermissions.length > 0;
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {isAdmin && (
        <Sidebar
          permissions={userPermissions}
          roleName={roleName}
          isOpen={sidebarOpen}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300`}
        style={{ marginLeft: isAdmin && sidebarOpen ? "16rem" : "0" }}
      >
        <Navbar onHamburgerClick={toggleSidebar} showHamburger={isAdmin} />

        <div className="flex-1 p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route
              path="/super-admin"
              element={
                <ProtectedRoute requireSuperAdmin={true}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-users"
              element={
                <ProtectedRoute allowedPermissions={["manage_users"]}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-roles"
              element={
                <ProtectedRoute allowedPermissions={["manage_roles"]}>
                  <ManageRoles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-posts"
              element={
                <ProtectedRoute allowedPermissions={["manage_posts"]}>
                  <ManagePosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute allowedPermissions={["create_posts"]}>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
