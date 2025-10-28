import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "../components/DashboardCard";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios"; // centralized axios instance

export default function SuperAdminDashboard() {
  const { token } = useAuth();

  // Fetch dashboard stats
  const { data, isLoading, isError } = useQuery({
    queryKey: ["superAdminDashboard"],
    queryFn: async () => {
      const res = await api.get("/api/super-admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-lg">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  const { totalUsers, activeRoles, totalPosts, monthlyActivity } = data;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Super Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Total Users"
            value={totalUsers}
            icon="👥"
            color="bg-blue-500"
          />
          <DashboardCard
            title="Active Roles"
            value={activeRoles}
            icon="🛡️"
            color="bg-purple-500"
          />
          <DashboardCard
            title="Posts Managed"
            value={totalPosts}
            icon="📝"
            color="bg-green-500"
          />
        </div>

        {/* Chart Section */}
        <div className="mt-12 bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Monthly Activity Overview
          </h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#3B82F6" name="New Users" />
                <Bar dataKey="posts" fill="#22C55E" name="New Posts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
