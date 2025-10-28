// src/pages/ManagePosts.jsx
import { useState, useEffect } from "react";
import { FileText, Edit, Trash2, Loader2, Search } from "lucide-react";
import api from "../api/axios"; // ← centralized axios
import { useAuth } from "../context/AuthContext";

export default function ManagePosts() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/posts"); // ← use centralized API
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.message || "Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setNewStatus(post.status || "Draft");
  };

  const handleSaveEdit = async () => {
    if (!selectedPost || !newStatus) return;

    try {
      setSaving(true);
      await api.put(
        `/api/posts/${selectedPost._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prev) =>
        prev.map((p) => (p._id === selectedPost._id ? { ...p, status: newStatus } : p))
      );

      setSelectedPost(null);
      setNewStatus("");
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.message || "Failed to update post status");
    } finally {
      setSaving(false);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 text-green-600" />
        <span className="ml-3">Loading posts...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          <FileText className="text-green-600" /> Manage Posts
        </h1>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-xl transition-transform duration-300 flex flex-col hover:-translate-y-1"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-green-50 rounded-xl mb-4 flex items-center justify-center text-green-400 font-medium">
                  No image available
                </div>
              )}

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{post.title}</h3>
              <p className="text-gray-600 text-sm flex-1 mb-3 line-clamp-3">{post.content}</p>

              {post.author && (
                <p className="text-sm text-gray-500 mb-2">
                  By <span className="font-medium">{post.author.username}</span>
                </p>
              )}

              <span
                className={`self-start mb-3 px-3 py-1 rounded-full text-sm font-semibold ${
                  post.status === "Published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {post.status || "Draft"}
              </span>

              <div className="flex justify-between items-center mt-auto">
                <button
                  onClick={() => handleEditClick(post)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit size={16} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(post._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors ml-2"
                  disabled={deletingId === post._id}
                >
                  <Trash2 size={16} />
                  {deletingId === post._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No posts found matching your search.</p>
      )}

      {/* Edit Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Edit Post Status</h2>
            <p className="text-gray-600 mb-4 text-center">
              <span className="font-medium">{selectedPost.title}</span>
            </p>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2 mb-6 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
