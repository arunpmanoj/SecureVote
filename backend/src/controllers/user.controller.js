exports.verifyUser = async (req, res) => {
  if (req.user.isVerified)
    return res.status(400).json({ message: "Already verified" });

  req.user.isVerified = true;
  req.user.verifiedAt = new Date();
  await req.user.save();

  res.json({ message: "Verification successful" });
};