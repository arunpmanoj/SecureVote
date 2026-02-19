const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  provider: String,
  providerId: String,

  // 👇 ADD THIS
  linkedinProfileUrl: {
    type: String,
    default: null,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  voterId: {
    type: String,
    unique: true,
    sparse: true,
  },

  hasVoted: {
    type: Boolean,
    default: false,
  },

  votedCandidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    default: null,
  },

  votingStartedAt: {
    type: Date,
    default: null,
  },
  votingEndsAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);