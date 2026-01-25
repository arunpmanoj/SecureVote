const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("../models/User");

/* SESSION */
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

/* GOOGLE */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback"
    },
    async (_, __, profile, done) => {
      const email = profile.emails?.[0]?.value;

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email,
          provider: "google",
          providerId: profile.id
        });
      }

      return done(null, user);
    }
  )
);

/* LINKEDIN (OPENID CONNECT) */
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/linkedin/callback",
      scope: ["openid", "profile"],
      state: true
    },
    async (_, __, profile, done) => {
      let user = await User.findOne({
        provider: "linkedin",
        providerId: profile.id
      });

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          provider: "linkedin",
          providerId: profile.id
        });
      }

      return done(null, user);
    }
  )
);