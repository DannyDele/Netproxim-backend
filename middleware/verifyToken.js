const jwt = require('jsonwebtoken');
const User = require('../model/User'); // Import your user model


//
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ msg: 'Access Denied' });
  const accessToken= authHeader.split(' ')[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403); // invalid token
      req.user = decoded.user; // Store just the user ID
      req.roles = decoded.roles; // Store the roles
      next();
    }
  );
};


module.exports = verifyToken;