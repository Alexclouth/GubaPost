// src/pages/CreatePost.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, CheckCircle2, Loader2 } from "lucide-react";
import api from "../api/axios"; // ← centralized axios
import { useAuth } from "../context/AuthContext";

export default function CreatePost() {
  const { user, token } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return setError("⚠️ Please fill out all required fields.");
    if (!user || !token) return setError("⚠️ You must be logged in.");

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      const res = await api.post("/api/posts", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTitle("");
      setContent("");
      setImage(null);
      setPreview(null);
      setTimeout(() => setSuccess(false), 3000);
      console.log("Post created:", res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "❌ Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-green-100 flex justify-center items-center p-6">
      <motion.div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-8 md:p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 text-center">
          ✍️ Create <span className="text-green-600">New Post</span>
        </h1>

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" /> <p>🎉 Post created successfully!</p>
          </motion.div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500"
            rows={6}
          />

          <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-green-50">
            <ImagePlus className="w-6 h-6 text-green-600 mr-2" /> Click or drag to upload
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          {preview && (
            <img src={preview} alt="preview" className="w-40 h-36 object-cover rounded-lg mt-4" />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white ${
              loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Create Post"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
