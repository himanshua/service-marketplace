import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";


const router = express.Router();
const allowedRoles = ["usernormal", "userexpert", "useradmin"];

// Optional: GET /api/auth to verify router is mounted
router.get("/", (_req, res) => {
  res.json({ ok: true, endpoints: ["POST /signup", "POST /login"] });
});

// Sign JWT with user id + role
function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: "7d" });
}

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("_id name email role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Error in /api/auth/me:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin-only ping
router.get("/admin/ping", requireAuth, requireRole("useradmin"), (_req, res) => {
  res.json({ ok: true, scope: "admin" });
});

// Expert-only ping
router.get("/expert/ping", requireAuth, requireRole("userexpert"), (_req, res) => {
  res.json({ ok: true, scope: "expert" });
});

// General authenticated ping
router.get("/ping", requireAuth, (_req, res) => {
  res.json({ ok: true, scope: "any-authenticated-user" });
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password, // hashed by model pre-save hook
      role: role || "usernormal"
    });

    const token = signToken(user);
    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // Support either method name from your model
    const cmp = user.comparePassword || user.matchPassword;
    const ok = cmp ? await cmp.call(user, password) : false;
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user);
    return res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/auth/admin/users - List all users (admin only)
router.get("/admin/users", requireAuth, requireRole("useradmin"), async (req, res) => {
  try {
    const users = await User.find().select("_id name email role");
    res.json({ users });
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */

export default router;
