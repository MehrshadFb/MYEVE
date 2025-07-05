const express = require("express");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} = require("../controllers/vehicleController");

const router = express.Router();

// Public routes (anyone can view vehicles)
router.get("/vehicles", getAllVehicles);
router.get("/vehicles/:id", getVehicleById);

// Admin-only routes (only admins can create, update, delete vehicles)
router.post("/vehicles", authenticateToken, authorizeRole("admin"), createVehicle);
router.put("/vehicles/:id", authenticateToken, authorizeRole("admin"), updateVehicle);
router.delete("/vehicles/:id", authenticateToken, authorizeRole("admin"), deleteVehicle);

module.exports = router; 