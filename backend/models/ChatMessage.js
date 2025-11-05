import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
  {
    expert: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: String, enum: ["customer", "expert"], required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", ChatMessageSchema);