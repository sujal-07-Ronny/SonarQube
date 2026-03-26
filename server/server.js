import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import client from "prom-client";

import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";
import alertRoute from "./routes/alertRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// 🟢 Check Mongo URI
if (!MONGO_URI) {
  console.error("❌ MongoDB URI is missing! Check your .env file.");
  process.exit(1);
}

// 🟢 Prometheus Metrics Setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// 🟢 Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🟢 Metrics Endpoint (IMPORTANT 🔥)
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// 🟢 Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};
connectDB();

// 🟢 Routes
app.use("/api/users", userRouter);
app.use("/api/image", imageRouter);

// 🟢 Alert Route (Alertmanager webhook 🔥)
app.use("/", alertRoute);

// 🟢 Request Logger
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  next();
});

// 🟢 Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// 🟢 Backend URL generator
app.get("/api/users/login", (req, res) => {
  const backendUrl = `${req.protocol}://${req.get("host")}`;
  res.status(200).json({
    success: true,
    backendUrl,
  });
});

// 🟢 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.path} not found`,
  });
});

// 🟢 Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 🟢 Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// 🟢 Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log("Server and DB connections closed");
      process.exit(0);
    });
  });
});