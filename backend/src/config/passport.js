const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const OpenIDConnectStrategy = require("passport-openidconnect").Strategy;

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
  "linkedin-oidc",
  new OpenIDConnectStrategy(
    {
      issuer: "https://www.linkedin.com",
      authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
      tokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
      userInfoURL: "https://api.linkedin.com/v2/userinfo",

      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: "openid profile email",
    },
    async (issuer, sub, profile, jwtClaims, accessToken, refreshToken, done) => {
      try {
        console.log("LinkedIn OIDC profile:", profile);
        console.log("LinkedIn sub:", sub);

        const providerId = sub;

        const name =
          profile?.displayName ||
          profile?.name?.givenName ||
          profile?.emails?.[0]?.value ||
          jwtClaims?.name ||
          "LinkedIn User";

        let user = await User.findOne({
          provider: "linkedin",
          providerId,
        });

        if (!user) {
          user = await User.create({
            name,
            provider: "linkedin",
            providerId,
            isVerified: false,
            hasVoted: false,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("🔥 LinkedIn OIDC error:", err);
        return done(err);
      }
    }
  )
);
module.exports = passport;