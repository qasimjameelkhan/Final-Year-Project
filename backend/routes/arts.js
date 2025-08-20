const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  createArt,
  updateArt,
  deleteArt,
  getAllArts,
  getSinglelArt,
  getAllPublicArts,
  getSinglelPublicArt,
} = require("../controllers/artController");
const { uploadArt } = require("../middleware/saveArts");

const router = express.Router();

router
  .route("/art/create")
  .post(isAuthenticatedUser, uploadArt.single("file"), createArt);

router
  .route("/art/update/:id")
  .put(isAuthenticatedUser, uploadArt.single("file"), updateArt);

router.route("/art/delete/:id").delete(isAuthenticatedUser, deleteArt);

router.route("/art/getAllArts").get(isAuthenticatedUser, getAllArts);

router.route("/art/getSingleArt/:id").get(isAuthenticatedUser, getSinglelArt);

router.route("/arts/getAllPublicArts").get(getAllPublicArts);

router.route("/arts/getSinglePublicArt/:id").get(getSinglelPublicArt);

module.exports = router;
