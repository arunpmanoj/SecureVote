const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

/* ===============================
   👥 GET ALL CANDIDATES (WITH VOTES)
   Used by:
   - VotingPage
   - LiveResultsPage
================================ */
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ name: 1 });
    res.json(candidates);
  } catch (err) {
    console.error("❌ Failed to fetch candidates:", err);
    res.status(500).json({ message: "Failed to load candidates" });
  }
});

/* ===============================
   🔍 GET SINGLE CANDIDATE BY ID
   Used by:
   - PostVoteConfirmationPage
================================ */
router.get("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json(candidate);
  } catch (err) {
    console.error("❌ Failed to fetch candidate:", err);
    res.status(500).json({ message: "Failed to load candidate" });
  }
});

module.exports = router;