const User = require('../../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const handleAsync = require('../../utils/errorHandlers/handleAsync')



const adminSignIn = handleAsync (async (req, res) => {
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

    // const Accesstoken = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES });
    // const refreshToken = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.REFRESH_SECRET_STR, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });
    // newUser.refreshToken = refreshToken;
    // console.log(token)
    // // Set the token in the Authorization header
    // res.setHeader('Authorization', `Bearer ${Accesstoken}`);

    const roles = adminUser.roles;
    const accessToken = jwt.sign(
      { adminUser: { id: adminUser._id, roles: adminUser.roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' }
    );
    
    const refreshToken = jwt.sign(
      { adminUser: { id: adminUser._id, roles: adminUser.role } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Store refreshToken in database
    adminUser.refreshToken = refreshToken;
    await adminUser.save();

    res.cookie('jwtCookie', refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });


    // Return a success response
    return res.status(200).json({ message: 'Sign-in successful', roles, accessToken });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = { adminSignIn };

