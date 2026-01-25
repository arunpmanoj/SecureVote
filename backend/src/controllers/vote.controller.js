const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");

exports.vote = async (req, res) => {
  const user = req.user;
  const { candidateId } = req.body;

  if (!user.isVerified)
    return res.status(403).json({ message: "Not verified" });

  if (user.hasVoted)
    return res.status(403).json({ message: "Already voted" });

  const diff = Date.now() - new Date(user.verifiedAt).getTime();
  if (diff > 5 * 60 * 1000)
    return res.status(403).json({ message: "Voting time expired" });

  await Vote.create({ userId: user._id, candidateId });
  await Candidate.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } });

  user.hasVoted = true;
  await user.save();

  res.json({ message: "Vote submitted" });
};