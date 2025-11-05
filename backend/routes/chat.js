import { Router } from "express";
import ChatMessage from "../models/ChatMessage.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/:expertId", requireAuth, async (req, res) => {
  const messages = await ChatMessage.find({
    expert: req.params.expertId,
    customer: req.user.id,
  }).sort({ createdAt: 1 });
  res.json({ messages });
});

router.post("/:expertId", requireAuth, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ message: "Message required" });

  const message = await ChatMessage.create({
    expert: req.params.expertId,
    customer: req.user.id,
    text,
  });

  res.status(201).json({ message });
});

export default router;