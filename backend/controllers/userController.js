import User from "../models/User.js";

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role");
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update user
export const updateUser = async (req, res) => {
  try {
    const { username, email, role, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    const updatedUser = await user.populate("role");

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};
