const express = require("express");
const passport = require("passport");

const router = express.Router();

// GOOGLE
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}`,
  }),
  (req, res) => {
    console.log("✅ Google OAuth success");
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
  }
);

// LINKEDIN (OIDC)
router.get("/linkedin", passport.authenticate("linkedin-oidc"));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin-oidc", {
    failureRedirect: `${process.env.FRONTEND_URL}`,
    session: true,
  }),
  (req, res) => {
    console.log("✅ LinkedIn OAuth success");
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
  }
);

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

router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("oauth-session");
      res.status(200).json({ message: "Logged out" });
    });
  });
});

module.exports = router;