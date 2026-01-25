const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("../models/User");

/* =========================
   SESSION HANDLING
========================= */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

/* =========================
   GOOGLE OAUTH
========================= */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // ✅ EXPLICIT callback URL
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            provider: "google",
            providerId: profile.id,
            isVerified: false,
            hasVoted: false,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

/* =========================
   LINKEDIN OAUTH
========================= */
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,

      // ✅ EXPLICIT callback URL
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ["openid", "profile", "email"],
      state: true,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          provider: "linkedin",
          providerId: profile.id,
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            provider: "linkedin",
            providerId: profile.id,
            isVerified: false,
            hasVoted: false,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;