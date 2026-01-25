const User = require("../models/User");
const generateToken = require("../config/jwt");

exports.login = async (req, res) => {
  const { name, email, provider, providerId } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ name, email, provider, providerId });
  }

  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      hasVoted: user.hasVoted
    }
  });
};