import { useState, useEffect } from "react";
import { Shield, Edit, Trash2, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function ManageRoles() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: "", description: "", permissions: [] });
  const [editingRoleId, setEditingRoleId] = useState(null);

  const permissionsList = ["manage_users", "manage_posts", "create_posts", "manage_roles"];

  // Fetch roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/roles");
        setRoles(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRole.name.trim()) return;

    try {
      if (editingRoleId) {
        const res = await axios.put(`http://localhost:5000/api/roles/${editingRoleId}`, newRole);
        setRoles(roles.map((r) => (r._id === editingRoleId ? res.data : r)));
        setEditingRoleId(null);
      } else {
        const res = await axios.post("http://localhost:5000/api/roles", newRole);
        setRoles([...roles, res.data]);
      }
      setNewRole({ name: "", description: "", permissions: [] });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save role");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/roles/${id}`);
      setRoles(roles.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete role");
    }
  };

  const handleEdit = (role) => {
    setNewRole({ name: role.name, description: role.description, permissions: role.permissions });
    setEditingRoleId(role._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-2">
        <Shield className="text-green-600" /> Manage Roles
      </h1>

      {/* Add / Edit Role Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-6 mb-10 max-w-xl mx-auto hover:shadow-lg transition-shadow duration-300"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {editingRoleId ? "Edit Role" : "Add New Role"}
        </h2>
        <input
          type="text"
          placeholder="Role Name"
          value={newRole.name}
          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 mb-3 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-700"
          required
        />
        <textarea
          placeholder="Description"
          value={newRole.description}
          onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
          className="border border-gray-300 rounded-lg w-full p-3 mb-4 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-700"
        />
        <div className="mb-4">
          <p className="font-medium text-gray-700 mb-2">Permissions:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {permissionsList.map((perm) => (
              <label
                key={perm}
                className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border hover:bg-green-50 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={newRole.permissions.includes(perm)}
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      permissions: e.target.checked
                        ? [...prev.permissions, perm]
                        : prev.permissions.filter((p) => p !== perm),
                    }))
                  }
                  className="accent-green-600"
                />
                <span className="text-gray-700 text-sm">{perm}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors font-medium"
        >
          {editingRoleId ? "Update Role" : "Add Role"}
        </button>
        {editingRoleId && (
          <button
            type="button"
            onClick={() => {
              setEditingRoleId(null);
              setNewRole({ name: "", description: "", permissions: [] });
            }}
            className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Roles Grid */}
      {roles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <div
              key={r._id}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{r.name}</h3>
                  <span className="text-sm text-gray-500">{r.permissions.length} perms</span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {r.description || "No description provided."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {r.permissions.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                    >
                      <CheckCircle2 size={12} /> {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hide Edit/Delete for Super Admin */}
              {r.name.toLowerCase() !== "super-admin" && (
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(r)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No roles available. Add a new one above.</p>
      )}
    </div>
  );
}
