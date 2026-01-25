const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { verifyUser } = require("../controllers/user.controller");

router.post("/verify", auth, verifyUser);

module.exports = router;