import { useState, useEffect } from "react";
import { Shield, Edit, Trash2, Loader2 } from "lucide-react";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch users and roles
  useEffect(() => {
  const fetchData = async () => {
    try {
      const [userRes, roleRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users"),
        axios.get("http://localhost:5000/api/roles"),
      ]);

      // Safely handle different possible response structures
      let allUsers = userRes.data?.users || userRes.data || [];

      // ✅ Filter out the superadmin regardless of letter case
      const filtered = allUsers.filter((u) => {
        const email =
          u?.email?.toLowerCase() ||
          u?.user?.email?.toLowerCase() ||
          "";
        return email !== "superadmin@gmail.com";
      });

      setUsers(filtered);
      setRoles(roleRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        setUsers(users.filter((u) => u._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  // ✅ Handle edit click
  const handleEditClick = (user) => {
    setEditingUser({
      _id: user._id,
      username: user.username,
      email: user.email,
      status: user.status,
      role: user.role?._id || user.role, // may be object or id
    });
    setIsEditing(true);
  };

  // ✅ Handle form input
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save edited user
  const handleSaveEdit = async () => {
    try {
      // Send only role ID and status
      const updatedData = {
        role: editingUser.role,
        status: editingUser.status,
      };

      const res = await axios.put(
        `http://localhost:5000/api/users/${editingUser._id}`,
        updatedData
      );

      // Update state
      setUsers(
        users.map((u) =>
          u._id === editingUser._id ? { ...u, ...res.data.user } : u
        )
      );

      setIsEditing(false);
      setEditingUser(null);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.response?.data?.message || "Failed to update user.");
    }
  };

  // ✅ Filter users by search
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-2">
          <Shield className="text-green-600" />{" "}
          <span className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Manage Users
          </span>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="animate-spin text-green-500" size={32} />
          <span className="ml-3 text-gray-600 text-lg">Loading users...</span>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUsers.map((u) => (
            <div
              key={u._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-green-500 to-green-700 h-28 relative">
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white bg-green-200 text-xl flex items-center justify-center font-bold text-gray-700 shadow-md">
                  {u.username?.[0]?.toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="pt-14 pb-5 px-5 text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {u.username}
                </h2>
                <p className="text-gray-500 text-sm">{u.email}</p>

                <div className="mt-3 flex justify-center gap-3">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {u.role?.name || "No Role"}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      u.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </div>

                <div className="flex justify-center gap-4 mt-5">
                  <button
                    onClick={() => handleEditClick(u)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          No users found matching your search.
        </p>
      )}

      {/* ✏️ Edit Modal */}
      {isEditing && editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit User</h2>

            <div className="space-y-3">
              {/* Role Dropdown */}
              <select
                name="role"
                value={editingUser.role}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>

              {/* Status Dropdown */}
              <select
                name="status"
                value={editingUser.status}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
