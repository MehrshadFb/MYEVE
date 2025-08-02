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
  deleteReview,
  exportCSV,
  importCSV,
  downloadCSV,
  csvUpload,
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
  upload.array("images", 10), // Increased from 5 to 10 images
  uploadImages
);
router.delete(
  "/vehicles/:vid/reviews/:reviewId",
  authenticateToken,
  authorizeRole("admin"),
  deleteReview
);

// CSV routes (admin only)
router.post(
  "/vehicles/csv/export",
  authenticateToken,
  authorizeRole("admin"),
  exportCSV
);

router.post(
  "/vehicles/csv/import",
  authenticateToken,
  authorizeRole("admin"),
  csvUpload.single('csvFile'),
  importCSV
);

router.get(
  "/vehicles/csv/download",
  authenticateToken,
  authorizeRole("admin"),
  downloadCSV
);

module.exports = router;
