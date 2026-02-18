const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Candidate = require("../models/Candidate");


const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};


router.post("/start-voting", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.isVerified) {
      return res.status(400).json({ message: "Voter ID not verified" });
    }

    if (user.hasVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    const now = new Date();

    
    if (user.votingEndsAt && now > user.votingEndsAt) {
      user.votingStartedAt = null;
      user.votingEndsAt = null;
    }

    
    if (user.votingStartedAt && user.votingEndsAt && now < user.votingEndsAt) {
      return res.json({
        votingStartedAt: user.votingStartedAt,
        votingEndsAt: user.votingEndsAt,
      });
    }

    
    user.votingStartedAt = now;
    user.votingEndsAt = new Date(now.getTime() + 5 * 60 * 1000);
    await user.save();

    res.json({
      votingStartedAt: user.votingStartedAt,
      votingEndsAt: user.votingEndsAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/voting-timer", requireAuth, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.hasVoted) {
    return res.status(400).json({ message: "Voting already completed" });
  }

  if (!user.votingStartedAt || !user.votingEndsAt) {
    return res.status(400).json({ message: "Voting not started" });
  }

  const now = new Date();

  if (now > user.votingEndsAt) {
    user.votingStartedAt = null;
    user.votingEndsAt = null;
    await user.save();
    return res.status(400).json({ message: "Voting window expired" });
  }

  res.json({
    votingStartedAt: user.votingStartedAt,
    votingEndsAt: user.votingEndsAt,
  });
});


router.post("/vote", requireAuth, async (req, res) => {
  try {
    const { candidateId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }

    if (user.hasVoted) {
      return res.status(400).json({ message: "You already voted" });
    }

    if (!user.votingStartedAt || !user.votingEndsAt) {
      return res.status(400).json({ message: "Voting not started" });
    }

    if (new Date() > user.votingEndsAt) {
      return res.status(400).json({ message: "Voting window expired" });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(400).json({ message: "Invalid candidate" });
    }

    
    candidate.voteCount += 1;
    await candidate.save();

    user.hasVoted = true;
    user.votedCandidate = candidate._id;
    await user.save();

    res.json({
      message: "Vote submitted successfully",
      candidate: candidate.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;