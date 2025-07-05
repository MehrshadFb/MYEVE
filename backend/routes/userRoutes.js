const express = require("express");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const {
  signUp,
  signIn,
  getAllUsers,
  deleteUserById,
} = require("../controllers/userController");
const {
  createAddress,
  getAllAddresses,
  getAllAddressesByUserId,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");

const router = express.Router();

// Public routes
router.post("/signup", signUp);
router.post("/signin", signIn);

// Admin-only routes
router.get("/users", authenticateToken, authorizeRole("admin"), getAllUsers);
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRole("admin"),
  deleteUserById
);

// User-specific routes
router.post("/addresses", authenticateToken, createAddress);
router.get("/addresses", authenticateToken, getAllAddresses);
router.get("/addresses/:userId", authenticateToken, getAllAddressesByUserId); // Assuming this function is defined in addressController.js
router.put("/addresses/:id", authenticateToken, updateAddress);
router.delete("/addresses/:id", authenticateToken, deleteAddress);

module.exports = router;
