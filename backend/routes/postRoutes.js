import express from "express";
import { createPost, getAllPosts, updatePostStatus, deletePost } from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// Create post (for dedicated page)
router.post("/", protect, upload.single("image"), createPost);

// Get all posts
router.get("/", getAllPosts);

// Update status
router.put("/:id/status", protect, updatePostStatus);

// Delete post
router.delete("/:id", protect, deletePost);

export default router;
