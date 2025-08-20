const express = require('express')
const {isAuthenticatedUser} = require('../middleware/auth')
const {resgisterUser, loginUser, logout} = require('../controllers/authController')
const {uploadPDF} = require('../middleware/SavePdf')

const router = express.Router();


router.route("/register").post(uploadPDF.single('files'), resgisterUser)

router.route('/loggedIn').post(loginUser, isAuthenticatedUser)

router.route('/logout').get(logout)

module.exports = router