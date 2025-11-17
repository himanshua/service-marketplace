import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
    // Always return an array, even if empty
    res.json({ users });
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/auth/admin/users/:id - Delete a user (admin only)
router.delete("/admin/users/:id", requireAuth, requireRole("useradmin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH /api/auth/admin/users/:id/role - Change a user's role (admin only)
router.patch("/admin/users/:id/role", requireAuth, requireRole("useradmin"), async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["usernormal", "userexpert", "useradmin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("_id name email role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Admin change user role error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH /api/auth/admin/users/:id - Update name/email (admin only)
router.patch("/admin/users/:id", requireAuth, requireRole("useradmin"), async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    ).select("_id name email role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Admin update user error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/auth/admin/users - Create user (admin only)
router.post("/admin/users", requireAuth, requireRole("useradmin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
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
});

// GET /api/auth/admin/users/:id - Get a single user by ID (admin only)
router.get("/admin/users/:id", requireAuth, requireRole("useradmin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "name email role _id");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/experts/:id - Get a single expert by ID (authenticated users)
router.get("/experts/:id", requireAuth, async (req, res) => {
  console.log("Fetching expert with ID:", req.params.id);
  const user = await User.findById(req.params.id).select("_id name email role");
  console.log("Expert found:", user);
  if (!user || user.role !== "userexpert") {
    //return res.status(404).json({ message: "Expert not found" });
  }
  res.json({ expert: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

// POST /api/auth/google-login
router.post("/google-login", async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  let user = await User.findOne({ email });
  if (!user) {
    // Generate a random password for Google users
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "usernormal",
    });
  }

  // Create JWT (adjust payload as needed)
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @swaggerr
 * /api/auth/register:
 *   post:
 *     summary: Register a new userr a new user
 *     requestBody:y:
 *       required: true
 *       content:
 *         application/json::
 *           schema:
 *             type: objectject
 *             properties:
 *               email:
 *                 type: string
 *               password:password:
 *                 type: string      type: string
 *     responses:
 *       201:
 *         description: User registered successfullyed successfully
 *       400:       400:
 *         description: Invalid inpution: Invalid input
 *
 * /api/auth/login:
 *   post:
 *     summary: Login a user user
 *     requestBody:y:
 *       required: true
 *       content:
 *         application/json::
 *           schema:
 *             type: objectject
 *             properties:
 *               email:
 *                 type: string
 *               password:password:
 *                 type: string      type: string
 *     responses:
 *       200:
 *         description: Login successfulsful
 *       401:      401:
 *         description: Unauthorized *         description: Unauthorized
 */

export default router;
