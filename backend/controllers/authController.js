import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const JWT_EXPIRES_IN = "7d";

// Signup
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultRole = await Role.findOne({ name: "User" });

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: defaultRole._id,
    });

    const populatedUser = await newUser.populate("role");

    // Generate JWT
    const token = jwt.sign({ id: populatedUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: populatedUser._id,
        username: populatedUser.username,
        email: populatedUser.email,
        status: populatedUser.status,
        createdAt: populatedUser.createdAt.toISOString(),
        updatedAt: populatedUser.updatedAt.toISOString(),
        role: populatedUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("role");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user (protected)
export const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate("role").select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};
