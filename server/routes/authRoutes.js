const express = require("express");
const {
  signUp,
  login,
  validateToken,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);

router.route("/validate-token").post(validateToken);
router.route("/logout").post(logout);

module.exports = router;
