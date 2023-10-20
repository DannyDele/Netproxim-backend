const User = require('../../model/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');



const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwtCookie) return res.sendStatus(401);
  const refreshToken = cookies.jwtCookie;

  const user = await User.findOne({ refreshToken }).exec();
  if (!user) return res.sendStatus(403); // Forbidden
  // Evaluate JWT
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user._id !== decoded.user._id) return res.sendStatus(403);
    const roles = user.roles;
    const accessToken = jwt.sign(
      
      { user: { id: user._id, roles: user.roles } },
   
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5m' }
    );
    res.json({ roles, accessToken });
  });
};

module.exports = { handleRefreshToken };