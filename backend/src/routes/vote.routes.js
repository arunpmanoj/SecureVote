const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { vote } = require("../controllers/vote.controller");

router.post("/", auth, vote);

module.exports = router;