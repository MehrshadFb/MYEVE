const express = require("express");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const {
  signUp,
  signIn,
  getAllUsers,
  deleteUserById,
} = require("../controllers/userController");

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

module.exports = router;
