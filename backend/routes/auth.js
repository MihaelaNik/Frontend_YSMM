const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/register", authController.getRegister);
router.post("/register", authController.register);
router.get("/login", authController.getLogin);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/session", authController.getSession);

module.exports = router;
