const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON requests

// import auth routes
const authRoutes = require("./routes/auth");

// connect auth routes
app.use("/api/auth", authRoutes); // prefix all auth routes with /api/auth

// Health route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Mongo connection only if not in test
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// Start server only if not under test
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
