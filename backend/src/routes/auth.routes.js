const express = require("express");
const passport = require("passport");

const router = express.Router();

/* ===============================
   🔐 GOOGLE OAUTH
================================ */

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL,
  }),
  (req, res) => {
    console.log("✅ Google OAuth success");

    // ✅ redirect to frontend dynamically
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
  }
);

/* ===============================
   🔐 LINKEDIN OAUTH
================================ */

router.get(
  "/linkedin",
  passport.authenticate("linkedin")
);

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    failureRedirect: process.env.FRONTEND_URL,
  }),
  (req, res) => {
    console.log("✅ LinkedIn OAuth success");

    // ✅ redirect to frontend dynamically
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
  }
);

/* ===============================
   👤 GET CURRENT USER (CRITICAL)
================================ */

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
    isDisqualified: req.user.isDisqualified || false,

    voterId: req.user.voterId || null,
    votedCandidate: req.user.votedCandidate || null,
  });
});

/* ===============================
   🚪 LOGOUT
================================ */

router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("oauth-session");
      res.redirect(process.env.FRONTEND_URL);
    });
  });
});

module.exports = router;