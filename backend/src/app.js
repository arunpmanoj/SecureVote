const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

// Load passport strategies
require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const votingRoutes = require("./routes/voting.routes");
const candidateRoutes = require("./routes/candidate.routes");
const voterRoutes = require("./routes/voter.routes");

const app = express();

/* =========================
   TRUST PROXY (REQUIRED ON RENDER)
========================= */
app.set("trust proxy", 1);

/* =========================
   CORS (CRITICAL)
========================= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // ✅ Vercel URL
    credentials: true,                // ✅ allow cookies
  })
);

/* =========================
   BODY PARSER
========================= */
app.use(express.json());

/* =========================
   SESSION (CRITICAL)
========================= */
app.use(
  session({
    name: "oauth-session",
    secret: process.env.SESSION_SECRET, // ✅ REQUIRED
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,        // ✅ REQUIRED (HTTPS only)
      sameSite: "none",    // ✅ REQUIRED (cross-domain)
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

/* =========================
   PASSPORT
========================= */
app.use(passport.initialize());
app.use(passport.session());

/* =========================
   ROUTES
========================= */
app.use("/auth", authRoutes);
app.use("/api", voterRoutes);
app.use("/api", votingRoutes);
app.use("/api/candidates", candidateRoutes);

/* =========================
   HEALTH CHECK (IMPORTANT)
========================= */
app.get("/health", (req, res) => {
  res.status(200).send("SERVER OK");
});

module.exports = app;