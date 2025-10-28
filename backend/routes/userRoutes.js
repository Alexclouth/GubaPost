import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser); // ✅ Add this route

export default router;
