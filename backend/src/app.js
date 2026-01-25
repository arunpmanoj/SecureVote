const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

// Load passport strategies
require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const votingRoutes = require("./routes/voting.routes");
const candidateRoutes = require("./routes/candidate.routes");


const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// IMPORTANT: session config for OAuth
app.use(
  session({
    name: "oauth-session",
    secret: "oauth-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,     // localhost
      sameSite: "lax"
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/api", require("./routes/voter.routes"));
app.use("/api", votingRoutes);
app.use("/api/candidates", candidateRoutes);

// Health check (VERY IMPORTANT for debugging)
app.get("/health", (req, res) => {
  res.send("SERVER OK");
});

module.exports = app;