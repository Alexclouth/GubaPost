import express from "express";
import { verifyToken, requireSuperAdmin } from "../middleware/auth.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Post from "../models/Post.js";

const router = express.Router();

router.get("/stats", verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeRoles = await Role.countDocuments();
    const totalPosts = await Post.countDocuments();

    const currentYear = new Date().getFullYear();

    const getMonthlyCounts = async (Model) => {
      return await Model.aggregate([
        { $match: { createdAt: { $gte: new Date(`${currentYear}-01-01`), $lte: new Date(`${currentYear}-12-31`) } } },
        { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
        { $sort: { "_id": 1 } },
      ]);
    };

    const userData = await getMonthlyCounts(User);
    const postData = await getMonthlyCounts(Post);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyActivity = months.map((month, idx) => ({
      month,
      users: userData.find(u => u._id === idx + 1)?.count || 0,
      posts: postData.find(p => p._id === idx + 1)?.count || 0,
    }));

    res.json({ totalUsers, activeRoles, totalPosts, monthlyActivity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching stats" });
  }
});

export default router;
