const User = require('../model/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const handleAsync = require('../utils/errorHandlers/handleAsync');
const {recordViewEvent, aggregateDailyViewCountWithNames,  aggregateMonthlyViewCountWithNames,} = require('../services/services'); 


// Json web token assigned to user function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES })
}





const getUser = handleAsync (async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you pass the user ID as a route parameter
    const user = await User.findById(userId).select('-password  -confirmPassword');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});


const checkUsernameAvailability = handleAsync(async (req, res) => {
  const { username } = req.query;

  const existingUser = await User.findOne({ username });

  try {
    
     // Check the length of the username
  if (username.length <= 5) {
    return res.status(400).json({ msg: 'Username length must be at least six characters long' });
  }


    if (!existingUser) {
      return res.status(200).json({ available: true });
    }

  if (existingUser.username === username) {
    return res.status(200).json({ available: false });
    }
    

  } catch (error) {
    console.log('Error Checking Username Availability:', error)
    return res.status(500).json({ error: 'Server error' });
    }
});


const editUser = handleAsync (async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, req.body, { runValidators: true });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.status(200).json(user); // Respond with the updated user object
  } catch (err) {
    console.error('Error editing user:', err);
    return res.status(500).json({ msg: 'Error Editing User' });
  }
});


 // Define the endpoint to get user information by unique ID
const getUserInfo =  handleAsync (async (req, res) => {
  const { uniqueID } = req.params;

  try {
    // Find the user by unique ID and exclude the password field
    const user = await User.findOne({ uniqueID }).select('-password  -confirmPassword -uniqueID -role  -qrCodeUrl' );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Record the view event for the user
    await recordViewEvent(user);

    // You can choose to aggregate view counts as needed
    // For example, daily view counts:
    const dailyCounts = await aggregateDailyViewCountWithNames(user);
    console.log(dailyCounts)

    // Or monthly view counts:
    const monthlyCounts = await aggregateMonthlyViewCountWithNames(user);

    // Return the user information and any aggregated data as a response
    res.status(200).json({ user, dailyCounts, monthlyCounts });
  } catch (error) {
    console.error('Error retrieving user information:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const forgotPassword = handleAsync (async(req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404).json({ msg: "User with this email does not exist in the database" });
    next()
  }

    const resetToken = user.createResetPasswordToken();
    await user.save();
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetpassword/${resetToken}`
    

     //Create Email Transport    
      const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,    // Gmail SMTP server
      port: process.env.EMAIL_PORT,                // SMTP port
      secure: true,             // Use SSL/TLS
      auth: {
          user: process.env.EMAIL_USER,  // Your Gmail email address
          pass: process.env.EMAIL_PASS,    // Your Gmail password

  },
});

        //Send the random password to the user's email
        const mailOptions = {
          from: 'Smart ID Card Solution <' + process.env.EMAIL_USER + '>', // Sender's email address
          to: user.email,                       // User's email address
          subject: 'Password Reset',
          html: `
    You have recieved a Password Reset link. Please use the below link to reset your password <br>
    ${resetUrl} <br> Note: This reset password link will be valid for only 10min
    
  `,
};
      

 transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save();
    return res.status(500).json({ error: 'Error sending email' });
  } else {
    console.log('Email sent:', info.response);
    return res.status(200).json({ message: 'Password Reset Link Sent' });
  }
});
  })


const resetPassword = handleAsync (async (req, res, next) => {
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: token, passwordResetTokenExpires: { $gt: Date.now() } });
  

  if (!user) {
  return res.status(404).json({ msg: 'Token is invalid or as expired' });
}

user.password = req.body.password;
user.confirmPassword = req.body.confirmPassword;
user.resetResetToken = undefined;
user.passwordResetTokenExpires = undefined;
user.passwordChangedAt = Date.now();
  
  // Save the user
  await user.save();
  
  // Login in the User
  const loginToken = signToken(user._id);
   
  return res.status(200).json({ msg: 'password reset successfull', loginToken });

})


module.exports = {  getUser, editUser , getUserInfo, resetPassword, forgotPassword, checkUsernameAvailability };
