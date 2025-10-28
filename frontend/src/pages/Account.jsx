import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Lock, Calendar, LogOut } from "lucide-react";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const createdAtStr = user.createdAt ? new Date(user.createdAt).toLocaleString() : "—";
  const statusStr = user.status || "Active";

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-green-100 p-6">
      <div className="relative w-full max-w-2xl bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-8 transition-all hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-8 tracking-tight">
          My Account
        </h2>

        <div className="space-y-5 text-gray-800">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <User className="text-green-600 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-semibold">{user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <Mail className="text-green-600 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <Shield className="text-green-600 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-semibold">{user.role?.name || "User"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <Lock className="text-green-600 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Permissions</p>
              <p className="font-semibold text-sm">
                {user.role?.permissions?.join(", ") || "User"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <Calendar className="text-green-600 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Account Created</p>
              <p className="font-semibold">{createdAtStr}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <Shield className="text-green-600 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p
                className={`font-semibold ${
                  statusStr === "Active" ? "text-green-600" : "text-red-600"
                }`}
              >
                {statusStr}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-10 flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
