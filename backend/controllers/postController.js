import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Create post (kept for dedicated page)
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).json({ message: "Title and content are required" });

    let imageUrl = "";

    if (req.file) {
      if (!process.env.CLOUDINARY_URL) {
        return res.status(500).json({ message: "Cloudinary credentials not found" });
      }

      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "GubaPost",
        });
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ message: "Image upload failed: " + err.message });
      }
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const newPost = await Post.create({
      title,
      content,
      image: imageUrl,
      author: req.user._id,
    });

    const populatedPost = await newPost.populate("author", "username email");

    res.status(201).json({ message: "Post created successfully", post: populatedPost });
  } catch (err) {
    console.error("CREATE POST ERROR:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("GET POSTS ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch posts: " + err.message });
  }
};

// Update post status
export const updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = status;
    await post.save();

    res.json({ message: "Post status updated successfully", post });
  } catch (err) {
    console.error("UPDATE POST ERROR:", err.message);
    res.status(500).json({ message: "Failed to update post: " + err.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await Post.deleteOne({ _id: id }); //FIX: remove() deprecated
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("DELETE POST ERROR:", err.message);
    res.status(500).json({ message: "Failed to delete post: " + err.message });
  }
};
