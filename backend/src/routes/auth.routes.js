const express = require("express");
const passport = require("passport");

const router = express.Router();

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173"
  }),
  (req, res) => {
    console.log("✅ Google OAuth success, redirecting to frontend");
    res.redirect("http://localhost:5173/oauth-success");
  }
);

// Get current logged-in user
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    provider: req.user.provider,
    isVerified: req.user.isVerified || false,
    hasVoted: req.user.hasVoted || false,
    isDisqualified: req.user.isDisqualified || false
  });
});
 
// Logout (optional but useful)
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.send("Logged out");
  });
});

router.get("/linkedin", passport.authenticate("linkedin"));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    failureRedirect: "http://localhost:5173"
  }),
  (req, res) => {
    console.log("✅ LinkedIn OAuth success, redirecting to frontend");
    res.redirect("http://localhost:5173/oauth-success");
  }
);

module.exports = router;