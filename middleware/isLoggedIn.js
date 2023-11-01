const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const AppError = require('../utils/errorHandlers/AppError');
const handleAsync = require('../utils/errorHandlers/handleAsync')


const isLoggedIn = handleAsync(async (req, res, next) => {

  // read the token a check if it exist
  const token = req.headers.authorization;
  let accessToken;
 
  if (token && token.startsWith('bearer')) {
    accessToken = token.split(' ')[1];
  }

  if (!accessToken) {
    return next(new AppError('You need to be logged in first', 401));
  }

  try {
     // Validate the token
    const decodedAccessToken = await util.promisify(jwt.verify)(accessToken, process.env.ACCESS_TOKEN_SECRET);  
    console.log(decodedAccessToken)
    // check if the user still exist
    const user = await User.findById(decodedAccessToken.id);
    
    if (!user) {
      return next(new AppError('The user with that token does not exist', 401));
    }

    // If the user changed password after the token was issued
    const isPasswordChanged = user.isPasswordChanged(decodedAccessToken.iat)

    if (await isPasswordChanged ) {
      return next(new AppError('The password has been changed recently. Please login again', 401))
    }

    // Allow user access to route
    req.user = user;
    next();

  } catch (error) {
    if (error.name = 'JsonWebTokenError') {
      return next(new AppError('Invalid Json Token', 400))
    }
      console.log('Error verifying token:', error);
      return res.status(401).json({ msg: 'Token has expired' });
    } 
  });

module.exports = { isLoggedIn };