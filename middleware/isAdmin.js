const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/User')


const isAdmin = async (req, res, next) => {
  // read the token a check if it exist
  const refreshToken = req.headers.authorization;
  let token;
 
  if (refreshToken && refreshToken.startsWith('Bearer ')) {
    token = refreshToken.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'Authoriztion failed, you need to be logged in first' });
  }

  try {
     // Validate the token
  const decoded = await util.promisify(jwt.verify)(token, process.env.REFRESH_TOKEN_SECRET);
      console.log(decoded);
        
      // Check if user is an Admin
        
      if (decoded.roles === 'admin') {
          next();
      }
      else{
          return res.status(403).json({ message: 'Access denied. User is not an admin.' });
          }
    
    // check if the user still exist
    // const user = await User.findById(decoded.id);
    // if (!user) {
    //   return res.status(401).json({msg: 'The user with that token does not exist'})
    // }

  } catch (error) {
      // Handle other JWT verification errors
      return res.status(401).json({ msg: 'Invalid token' });
  }
}

;

module.exports = { isAdmin };