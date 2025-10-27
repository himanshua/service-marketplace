import express from "express";
import User from "../models/User.js";
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

// POST /api/auth/admin/users - Create user
router.post(
  "/admin/users",
  requireAuth,
  requireRole("useradmin"),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email, and password are required." });
      }
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Email already exists." });
      }
      const user = new User({ name, email, password, role });
      await user.save();
      res.status(201).json({ user });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;