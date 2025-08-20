const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { isAuthenticatedUser } = require("../middleware/auth");

// Add item to cart
router.post("/cart/add", isAuthenticatedUser, addToCart);

// Get user's cart
router.get("/cart", isAuthenticatedUser, getCart);

// Update cart item quantity
router.put("/cart/:cartId", isAuthenticatedUser, updateCartItem);

// Remove item from cart
router.delete("/cart/:cartId", isAuthenticatedUser, removeFromCart);

// Clear user's cart
router.delete("/cart", isAuthenticatedUser, clearCart);

module.exports = router;
