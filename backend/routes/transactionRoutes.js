const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  getAnalyticsSummary,
  getSalesByCategory,
} = require("../controllers/transactionController");
const { isAuthenticatedUser } = require("../middleware/auth");

// Admin routes
router.get("/admin/transactions", isAuthenticatedUser, getAllTransactions);
router.get("/admin/analytics", isAuthenticatedUser, getAnalyticsSummary);
router.get("/admin/sales-by-category", isAuthenticatedUser, getSalesByCategory);

module.exports = router;
