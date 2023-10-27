const User = require('../../model/User');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const handleAsync = require('../../utils/errorHandlers/handleAsync');
const AppError = require('../../utils/errorHandlers/AppError')




const signIn = handleAsync (async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
     return next( new AppError('please provide email and password', 400))
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(400).json({ error: 'Email or Password incorrect' });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Email or Password incorrect' });
    }

    const accessToken = jwt.sign({ id: foundUser._id, role: foundUser.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.LOGIN_EXPIRES });
    // const refreshToken = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.REFRESH_SECRET_STR, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });
    // newUser.refreshToken = refreshToken;

  
    // Return a success response
    return res.status(200).json({ message: 'Sign-in successful',accessToken });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = { signIn };






