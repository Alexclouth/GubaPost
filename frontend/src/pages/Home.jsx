// src/pages/Home.jsx
import { useState, useEffect } from "react";
import api from "../api/axios"; // ← centralized axios
import Navbar from "../components/Navbar";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from backend
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/posts"); // ← use centralized API
      // Only show published posts and sort by newest
      const publishedPosts = res.data
        .filter((post) => post.status === "Published")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(publishedPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
          Latest <span className="text-green-600">Posts</span>
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No published posts available.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition transform duration-300"
              >
                <div className="relative">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="rounded-t-2xl w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="rounded-t-2xl w-full h-56 bg-green-50 flex items-center justify-center text-green-400">
                      No image
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-medium text-gray-700">
                      ✍️ {post.author?.username || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
