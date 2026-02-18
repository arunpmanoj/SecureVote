const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const votingRoutes = require("./routes/voting.routes");
const candidateRoutes = require("./routes/candidate.routes");
const voterRoutes = require("./routes/voter.routes");

const app = express();


app.set("trust proxy", 1);


app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


app.use(express.json());


app.use(
  session({
    name: "oauth-session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());


app.use("/auth", authRoutes);
app.use("/api", voterRoutes);
app.use("/api", votingRoutes);
app.use("/api/candidates", candidateRoutes);


app.get("/health", (req, res) => {
  res.status(200).send("SERVER OK");
});

module.exports = app;