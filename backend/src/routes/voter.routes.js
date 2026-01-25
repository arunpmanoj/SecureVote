const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

/* FILE UPLOAD CONFIG */
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

/* VERIFY VOTER ID */
router.post(
  "/verify-voter",
  requireAuth,
  upload.single("document"),
  async (req, res) => {
    try {
      const { voterId } = req.body;

      if (!voterId) {
        return res.status(400).json({ message: "Voter ID is required" });
      }

      // 🔒 Check uniqueness
      const existing = await User.findOne({ voterId });
      if (existing) {
        return res.status(409).json({
          message: "This Voter ID is already used"
        });
      }

      // Save to logged-in user
      req.user.voterId = voterId;
      req.user.isVerified = true;

      if (req.file) {
        // For now just store filename (later S3 / Cloudinary)
        req.user.voterIdDocumentUrl = req.file.originalname;
      }

      await req.user.save();

      res.json({
        success: true,
        voterId: req.user.voterId
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Verification failed" });
    }
  }
);

module.exports = router;