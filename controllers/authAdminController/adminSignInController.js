const User = require('../../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const handleAsync = require('../../utils/errorHandlers/handleAsync')
const AppError = require('../../utils/errorHandlers/AppError')




const adminSignIn = handleAsync (async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
     return next( new AppError('please provide email and password', 400))
    }

    const adminUser = await User.findOne({ email });

    if (!adminUser) {
      return res.status(400).json({ error: 'Email or Password incorrect' });
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Email or Password incorrect' });
    }

    const accessToken = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.LOGIN_EXPIRES });
  
  
    // Return a success response
    return res.status(200).json({ message: 'Sign-in successful', accessToken });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = { adminSignIn };