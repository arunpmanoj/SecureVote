const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }
}, { timestamps: true });

module.exports = mongoose.model("Vote", voteSchema);