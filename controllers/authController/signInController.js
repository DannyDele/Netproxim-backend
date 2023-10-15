const User = require('../../model/User');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');





const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    
    // if (!email || !password) {  
    //   return res.status(400).json({ msg: 'Please provide an email and  password' });
    // }
    // next();

    // Find the user by their email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Email or Password incorrect' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Email or Password incorrect' });
    }

    // If both email and password are valid, store user information in the session
    // req.session.userId = user._id;
    // console.log(`seseeionID: ${req.session.userId}`)
    // const token = jwt.sign({ id: newUser._id }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES })
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES });
          
    return res.status(200).json({ message: 'Sign-in successful', token });

  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};





module.exports = {signIn}