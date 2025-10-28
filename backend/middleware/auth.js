import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// verifyToken middleware
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Populate role to get name & permissions
    const user = await User.findById(decoded.id)
      .populate("role", "name permissions")
      .select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

// requireSuperAdmin middleware
export const requireSuperAdmin = (req, res, next) => {
  if (req.user.role?.name !== "Super-admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// backward compatibility
export const protect = verifyToken;
