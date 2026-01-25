const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

/* GET ALL CANDIDATES */
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* GET CANDIDATE BY ID */
router.get("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json(candidate);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;