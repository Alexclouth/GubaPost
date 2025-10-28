import mongoose from "mongoose";
import Role from "./models/Role.js"; 
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/your_db_name";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Function to create default role
const createDefaultRole = async () => {
  try {
    const existingRole = await Role.findOne({ name: "User" });
    if (existingRole) {
      console.log("Role 'User' already exists:", existingRole);
      return process.exit(0);
    }

    const userRole = await Role.create({
      name: "User",
      description: "Basic user with limited permissions",
      permissions: ["user"], // default permission
    });

    console.log("Created default role:", userRole);
    process.exit(0);
  } catch (err) {
    console.error("Error creating default role:", err);
    process.exit(1);
  }
};

createDefaultRole();
