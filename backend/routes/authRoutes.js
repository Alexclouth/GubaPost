import express from "express";
import { signup, loginUser } from "../controllers/authController.js";
import { getCurrentUser } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginUser); // ✅ add this
router.get("/me", protect, getCurrentUser);


export default router;
