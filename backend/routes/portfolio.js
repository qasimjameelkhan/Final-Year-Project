const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  getPortfolio,
} = require("../controllers/portfolioController");
const { uploadPortfolio } = require("../middleware/savePortfolio");

const router = express.Router();

router
  .route("/portfolio/create")
  .post(isAuthenticatedUser, uploadPortfolio.single("file"), createPortfolio);

router
  .route("/portfolio/update/:id")
  .put(isAuthenticatedUser, uploadPortfolio.single("file"), updatePortfolio);

router
  .route("/portfolio/delete/:id")
  .delete(isAuthenticatedUser, deletePortfolio);

router.route("/portfolio").get(isAuthenticatedUser, getPortfolio);

module.exports = router;
