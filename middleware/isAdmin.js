const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const AppError = require('../utils/errorHandlers/AppError');


const isAdmin = async (req, res, next) => {

  // read the token a check if it exist
  const token = req.headers.authorization;
  let accessToken;
 
  if (token && token.startsWith('bearer')) {
    accessToken = token.split(' ')[1];
  }

  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // Check if the user has the admin role

  try {
    // Validate the token
    const decodedAccessToken = await util.promisify(jwt.verify)(accessToken, process.env.ACCESS_TOKEN_SECRET);
    // check if the user still exist
    const user = await User.findById(decodedAccessToken.id);
    console.log(decodedAccessToken.role)
    
    if (decodedAccessToken.role !== 'admin') {
      return next(new AppError('Forbidden', 403));
    }

    // Allow Admin Access to Route
    next()
  }
  catch (error) {
    console.log('Error in verifying user', error)
  }
}

module.exports = { isAdmin }