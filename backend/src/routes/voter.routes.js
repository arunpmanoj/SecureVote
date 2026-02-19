const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * POST /api/verify-voter
 * Verifies voter ID and stores LinkedIn profile URL (optional)
 */
router.post(
  "/verify-voter",
  requireAuth,
  upload.single("document"),
  async (req, res) => {
    try {
      console.log("REQ BODY:", req.body);

      const { voterId, linkedinProfileUrl } = req.body;

      if (!voterId) {
        return res.status(400).json({ message: "Voter ID is required" });
      }

      // Check if voterId already used
      const existing = await User.findOne({ voterId });
      if (existing) {
        return res.status(409).json({
          message: "This Voter ID is already used",
        });
      }

      // Save voter verification details
      req.user.voterId = voterId;
      req.user.isVerified = true;

      // ✅ Save LinkedIn profile URL if provided
      if (linkedinProfileUrl && linkedinProfileUrl.trim()) {
        req.user.linkedinProfileUrl = linkedinProfileUrl.trim();
      }

      // Optional document upload
      if (req.file) {
        req.user.voterIdDocumentUrl = req.file.originalname;
      }

      await req.user.save();

      res.json({
        success: true,
        voterId: req.user.voterId,
        linkedinProfileUrl: req.user.linkedinProfileUrl || null,
      });
    } catch (err) {
      console.error("Verification failed:", err);
      res.status(500).json({ message: "Verification failed" });
    }
  },
);

/**
 * GET /api/voted-users
 * Returns list of users who have voted (name, voterId, LinkedIn URL)
 */
router.get("/voted-users", requireAuth, async (req, res) => {
  try {
    const users = await User.find({ hasVoted: true }).select(
      "name voterId linkedinProfileUrl",
    );

    res.json(users);
  } catch (err) {
    console.error("Error fetching voted users:", err);
    res.status(500).json({ message: "Failed to fetch voted users" });
  }
});

module.exports = router;
