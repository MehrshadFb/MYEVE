const express = require("express");
const cors = require("cors");
const { syncDatabase } = require("./models/index");
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const cartRoutes = require('./routes/cartRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", cartRoutes)


// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = { app, syncDatabase };
