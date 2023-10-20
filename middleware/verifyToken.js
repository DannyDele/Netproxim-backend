const jwt = require('jsonwebtoken');
const User = require('../model/User'); // Import your user model
const util = require('util');


// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization; // Assuming you send the token in the Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_STR); // Verify and decode the token
    const userId = decoded._id;

    // Check if the user exists and the refreshToken matches
    const user = await User.findById(userId);
    if (!user || user.refreshToken !== req.headers.refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // If the token is valid, generate a new token and send it in the response
    const newToken = jwt.sign({ id: userId, role: user.role }, process.env.SECRET_STR, {
      expiresIn: process.env.LOGIN_EXPIRES,
    });

    res.setHeader('Authorization', `Bearer ${newToken}`);
    next(); // Call next only when everything is successful
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;