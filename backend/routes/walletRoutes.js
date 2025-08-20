const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  getWallet,
  createPaymentIntent,
  addFunds,
  transferFunds,
  getTransactions,
} = require("../controllers/walletController.js");

const router = express.Router();

// Get wallet balance
router.route("/wallet").get(isAuthenticatedUser, getWallet);

// Create payment intent for adding funds
router
  .route("/wallet/create-payment-intent")
  .post(isAuthenticatedUser, createPaymentIntent);

// Add funds to wallet
router.route("/wallet/add-funds").post(isAuthenticatedUser, addFunds);

// Transfer funds to another user
router.route("/wallet/transfer").post(isAuthenticatedUser, transferFunds);

// Get transaction history
router.route("/wallet/transactions").get(isAuthenticatedUser, getTransactions);

module.exports = router;
