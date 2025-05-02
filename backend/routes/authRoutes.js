const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/authControllers");

router.post("/signup", signup);
router.post("/login", login);


module.exports = router;
