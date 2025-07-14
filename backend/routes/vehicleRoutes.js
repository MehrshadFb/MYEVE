const express = require("express");
const upload = require("../utils/s3Uploader");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  uploadImages,
  submitReview,
} = require("../controllers/vehicleController");

const router = express.Router();

// Public routes (anyone can view vehicles)
router.get("/vehicles", getAllVehicles);
router.get("/vehicles/:vid", getVehicleById);

// Signed-in user routes (can post reviews)
router.post("/vehicles/:vid/reviews", authenticateToken, submitReview);

// Admin-only routes (only admins can create, update, delete vehicles)
router.post(
  "/vehicles",
  authenticateToken,
  authorizeRole("admin"),
  createVehicle
);
router.put(
  "/vehicles/:vid",
  authenticateToken,
  authorizeRole("admin"),
  updateVehicle
);
router.delete(
  "/vehicles/:vid",
  authenticateToken,
  authorizeRole("admin"),
  deleteVehicle
);
router.post(
  "/vehicles/:vid/images",
  authenticateToken,
  authorizeRole("admin"),
  upload.array("images", 5),
  uploadImages
);

module.exports = router;
