const User = require('../../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const adminSignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminUser = await User.findOne({ email });

    if (!adminUser) {
      return res.status(400).json({ error: 'Email or Password incorrect' });
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Email or Password incorrect' });
    }

    const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES });

    // Set the token in the Authorization header
    res.setHeader('Authorization', `Bearer ${token}`);

    // Return a success response
    return res.status(200).json({ message: 'Sign-in successful', token });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { adminSignIn };

