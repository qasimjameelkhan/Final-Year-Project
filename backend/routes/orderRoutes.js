const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderDetails,
} = require("../controllers/orderController");

const { isAuthenticatedUser } = require("../middleware/auth");

// Create new order
router.route("/order/new").post(isAuthenticatedUser, createOrder);

// Get all orders for the authenticated user
router.route("/orders/me").get(isAuthenticatedUser, getUserOrders);

// Get single order by ID
router.route("/order/:orderId").get(isAuthenticatedUser, getOrderDetails);

module.exports = router;
