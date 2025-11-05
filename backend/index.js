/**
 * Backend entry point
 */
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import userRoutes from "./routes/users.js";
import chatRoutes from "./routes/chat.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.set('trust proxy', 1);

const allowedOrigins = [
  "http://localhost:3000",
  "https://service-marketplace-frontend-7x28.vercel.app",
  "https://aheadterra.com",
  "https://www.aheadterra.com"
  // Add any other Vercel preview domains you use
];

function dynamicCorsOrigin(origin, callback) {
  // Allow requests with no origin (like curl, Postman, etc.)
  if (!origin) return callback(null, true);
  // Allow production and any Vercel preview domain
  if (
    allowedOrigins.includes(origin) ||
    /\.vercel\.app$/.test(origin)
  ) {
    return callback(null, true);
  }
  return callback(new Error("Not allowed by CORS"));
}

app.use(cors({
  origin: dynamicCorsOrigin,
  credentials: true,
}));
/*
// Also handle preflight requests
app.options("/*", cors({
  origin: dynamicCorsOrigin,
  credentials: true,
}));
*/
// Simple request log to verify routing
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Mount auth routes
app.use("/api/auth", authRoutes);
console.log("Auth routes mounted at /api/auth");

// Mount services routes
app.use("/api/services", serviceRoutes);
console.log("Services routes mounted at /api/services");

// Mount users routes
app.use("/api/users", userRoutes);
console.log("Users routes mounted at /api/users");

// Mount chat routes
app.use("/api/chat", chatRoutes);
console.log("Chat routes mounted at /api/chat");

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Service Marketplace API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // Path to your route files
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to the database
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
}

// Start + DB connect
async function start() {
  if (process.env.NODE_ENV === "test") return;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("FATAL ERROR: MONGO_URI not set in env");
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`API listening on port ${port}`));
  } catch (err) {
    console.error("FATAL ERROR: Failed to connect to MongoDB", err.message);
    process.exit(1);
  }
}
start();

app.get("/", (req, res) => {
  res.send("Service Marketplace API is running.");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
