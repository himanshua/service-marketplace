import express from "express";
import mongoose from "mongoose";
console.log("About to import Service model");
import Service from "../models/serviceSchema.js";
console.log("Service model imported:", typeof Service);
import { requireAuth, requireRole } from "../middleware/auth.js";
const router = express.Router(); // Create router
console.log("Loaded routes/services.js");


/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     responses:
 *       200:
 *         description: List of services
 */

// GET /api/services/admin - List all services (admin only)
router.get("/admin", requireAuth, requireRole("useradmin"), async (req, res) => {
  console.log("Admin GET /api/services/admin route hit");
  try {
    console.log("About to call Service.find()");
    //const services = await Service.find();
    const services = await Service.find().populate("provider", "name email role");
    console.log("Service.find() returned:", services);
    res.json({ services });
  } catch (err) {
    console.error("Admin get services error:", err && (err.stack || err.message || err));
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/services - Get all active services (public)
router.get("/", async (req, res) => {
  try {
    const { provider } = req.query;
    const query = {};
    if (provider) query.provider = provider;
    //const services = await Service.find(query);
    const services = await Service.find(query).populate("provider", "name email role");
    res.status(200).json(services);
  } catch (err) {
    console.error("Error in GET /api/services:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// GET /api/services/:id - Get a single service (public)
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("provider", "name email role"); // Fetch service by ID
    if (!service) return res.status(404).json({ message: "Service not found" }); // Not found
    res.json(service); // Return service
  } catch (err) {
    res.status(500).json({ message: "Server error" }); // Error
  }
});

// POST /api/services - Create a new service (authenticated users)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, price, category, status, approved } = req.body;

    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const service = await Service.create({
      title,
      description,
      price,
      category,
      provider: req.user.id,
      status,
      approved
    });

    res.status(201).json(service);
  } catch (err) {
    console.error("Error in POST /api/services:", err); // Log the error
    res.status(500).json({ message: "Server error" });
  }
});



// PUT /api/services/:id - Update a service (only provider or admin)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id); // Find service
    if (!service) return res.status(404).json({ message: "Service not found" }); // Not found
    if (service.provider.toString() !== req.auth.id && req.auth.role !== "useradmin") { // Check ownership or admin
      return res.status(403).json({ message: "Forbidden" }); // Forbidden
    }
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update
    res.json(updated); // Return updated service
  } catch (err) {
    res.status(500).json({ message: "Server error" }); // Error
  }
});

// DELETE /api/services/:id - Delete a service (only provider or admin)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id); // Find service
    if (!service) return res.status(404).json({ message: "Service not found" }); // Not found
    if (service.provider.toString() !== req.auth.id && req.auth.role !== "useradmin") { // Check ownership or admin
      return res.status(403).json({ message: "Forbidden" }); // Forbidden
    }
    await Service.findByIdAndDelete(req.params.id); // Delete
    res.json({ message: "Service deleted" }); // Success
  } catch (err) {
    res.status(500).json({ message: "Server error" }); // Error
  }
});



// PATCH /api/services/admin/:id/approve - Approve/unapprove a service (admin only)
router.patch("/admin/:id/approve", requireAuth, requireRole("useradmin"), async (req, res) => {
  try {
    const { approved } = req.body; // expects { approved: true/false }
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true }
    );
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ service });
  } catch (err) {
    console.error("Admin approve service error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/services/admin/:id - Delete a service (admin only)
router.delete("/admin/:id", requireAuth, requireRole("useradmin"), async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted" });
  } catch (err) {
    console.error("Admin delete service error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH /api/services/admin/:id - Edit a service (admin only)
router.patch("/admin/:id", requireAuth, requireRole("useradmin"), async (req, res) => {
  try {
    const { title, description } = req.body; // Add other fields as needed
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ service });
  } catch (err) {
    console.error("Admin edit service error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router; // Export router

