const express = require("express");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

// User routes
router.post("/orders", authenticateToken, createOrder);
router.get("/orders", authenticateToken, getUserOrders);
router.get("/orders/:orderId", authenticateToken, getOrderById);

// Admin routes
router.get(
  "/admin/orders",
  authenticateToken,
  authorizeRole("admin"),
  getAllOrders
);
router.put(
  "/admin/orders/:orderId",
  authenticateToken,
  authorizeRole("admin"),
  updateOrderStatus
);

module.exports = router;
