const User = require('../../model/User');

const signOut = async (req, res) => {
  const cookies = req.cookies; 
  if (!cookies?.jwtCookie) return res.status(401);

  const refreshToken = cookies.jwtCookie;
  const user = await User.findOne({ refreshToken }).exec();
  if (!user) return res.sendStatus(403);

  // Clear refreshToken from database
  user.refreshToken = '';
  await user.save();

  // Clear accessToken from memory
  res.clearCookie('jwtCookie');
  res.sendStatus(200); 
};

module.exports = { signOut };