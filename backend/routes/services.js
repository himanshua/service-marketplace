import express from "express";
import mongoose from "mongoose";
import Service from "../models/serviceSchema.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router(); // Create router

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     responses:
 *       200:
 *         description: List of services
 */
// GET /api/services - Get all active services (public)
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/services called"); // Log when the route is hit
    const services = await Service.find(); // Fetch services from the database
    res.status(200).json(services);
  } catch (err) {
    console.error("Error in GET /api/services:", err); // Log the error
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/services/:id - Get a single service (public)
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("provider", "name email"); // Fetch service by ID
    if (!service) return res.status(404).json({ message: "Service not found" }); // Not found
    res.json(service); // Return service
  } catch (err) {
    res.status(500).json({ message: "Server error" }); // Error
  }
});

// POST /api/services - Create a new service (authenticated users)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const service = await Service.create({
      title,
      description,
      price,
      category,
      provider: req.user.id,
      status: "available",
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

export default router; // Export router

