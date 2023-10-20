const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/User')


const isLoggedIn = async (req, res, next) => {
  // read the token a check if it exist
  const testToken = req.headers.authorization;
  let token;
 
  if (testToken && testToken.startsWith('Bearer ')) {
    token = testToken.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'You need to be logged in first' });
  }

  // If a token is found, call the next middleware or route handler
  try {
     // Validate the token
  const decoded = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
    console.log(decoded)
    
    // check if the user still exist
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({msg: 'The user with that token does not exist'})
    }
      next();


  } catch (error) {
  
      return res.status(401).json({ msg: 'Token has expired' });
    } 
  }

;

module.exports = { isLoggedIn };