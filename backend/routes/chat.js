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
  if (!text?.trim()) {
    return res.status(400).json({ message: "Message required" });
  }

  const customerMessage = await ChatMessage.create({
    expert: req.params.expertId,
    customer: req.user.id,
    sender: "customer",
    text: text.trim(),
  });

  const expertMessage = await ChatMessage.create({
    expert: req.params.expertId,
    customer: req.user.id,
    sender: "expert",
    text: "You will receive the answer within 24 hours here and at your email address.",
  });

  res.status(201).json({ customerMessage, expertMessage });
});

export default router;