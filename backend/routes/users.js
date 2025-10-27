import express from "express";
import User from "../models/userSchema.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/users - List all users (admin only)
router.get("/", requireAuth, requireRole("useradmin"), async (req, res) => {
  try {
    const users = await User.find({}, "name email role _id");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;