const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

const User = require("../models/User");


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


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

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

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,

      // 🔴 IMPORTANT: start with only lite profile (email often causes failure if not approved)
      scope: ["r_liteprofile"],

      state: true,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        console.log("LinkedIn profile:", JSON.stringify(profile, null, 2)); // 🔍 Debug log

        const name =
          profile.displayName ||
          profile.username ||
          profile.name?.givenName ||
          "LinkedIn User";

        let user = await User.findOne({
          provider: "linkedin",
          providerId: profile.id,
        });

        if (!user) {
          user = await User.create({
            name,
            provider: "linkedin",
            providerId: profile.id,
            isVerified: false,
            hasVoted: false,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("🔥 LinkedIn OAuth error:", err);
        return done(err);
      }
    }
  )
);

module.exports = passport;