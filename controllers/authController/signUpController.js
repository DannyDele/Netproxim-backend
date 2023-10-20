const User = require('../../model/User');
const QRcode = require('qrcode');
const bcrypt = require('bcrypt');
const AppError = require('../../utils/errorHandlers/AppError');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Require nodemailer
const session = require('express-session');
const jwt = require('jsonwebtoken');
const handleAsync = require('../../utils/errorHandlers/handleAsync')

   

//    //Create Email Transport    
//       const transporter = nodemailer.createTransport({
//       host: process.env.GMAIL_HOST,    // Gmail SMTP server
//       port: process.env.GMAIL_PORT,                // SMTP port
//       secure: true,             // Use SSL/TLS
//       auth: {
//           user: process.env.GMAIL_USER,  // Your Gmail email address
//           pass: process.env.GMAIL_PASS,    // Your Gmail password

//   },
// });


const generateRandomPassword = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

// Generating a unique token for user
function generateUniqueToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

const uniqueToken = generateUniqueToken();




const signUp = handleAsync (async (req, res) => {
  const { username, firstName, lastName, email, phoneNumber, businessName, businessLogo, roles } = req.body;
 

  try {

    const existingUserWithEmail = await User.findOne({ email });

    if (existingUserWithEmail) {
      return res.status(400).json({ error: 'Email is already registered. Please use a different email address.' });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username is taken, please choose another username.' });
    }

    const uniqueID = crypto.randomUUID(); //Generating UniqueID for User
    const imageId = crypto.randomUUID()
    const randomPassword = generateRandomPassword(8);
    console.log(randomPassword);
    const hashPassword = await bcrypt.hash(randomPassword, 12);

    
    const newUser = new User({
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      businessName: businessName,
      businessLogo: businessLogo,
      // profilePic: profilePic,
      roles: roles,
      password: hashPassword,
      confirmPassword: hashPassword,
      uniqueID: uniqueID ,         //Storing the unique ID in the user document
      resetToken: uniqueToken
    });
    // Save image cloudinary path to the database
     newUser.businessLogo = { url: req.file.path, filename: req.file.filename, public_id: `${imageId}-${Date.now()}` };
    //  newUser.profilePic = { url: req.files.path, filename: req.files.filename };
     console.log(res.file)



    // Generate the QR code using userWithoutPassword and store the URL in newUser.qrCodeUrl
    QRcode.toDataURL(JSON.stringify(`${req.protocol}://${req.get('host')}/getuserinfo/${uniqueID}`), async (err, url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return res.status(500).json({ error: 'Error generating QR code' });
      } else {
        newUser.qrCodeUrl = url; // Store the QR code URL in the user object
        }
         
        // signing a jwt token to a user
      // const Accesstoken = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.LOGIN_EXPIRES });
      // const refreshToken = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });
      // newUser.refreshToken = refreshToken;

      //  // Set the token in the Authorization header
      //  res.setHeader('Authorization', `Bearer ${Accesstoken}`);

       const roles = newUser.roles;
    const accessToken = jwt.sign(
      { newUser: { id: newUser._id, roles: newUser.roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' }
    );
    
    const refreshToken = jwt.sign(
      { newUser: { id: newUser._id, roles: newUser.roles } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Store refreshToken in database
    newUser.refreshToken = refreshToken;
        await newUser.save();

    res.cookie('jwtCookie', refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

        console.log(accessToken, roles)

          // Save the user to the database, including the QR code URL
        res.status(200).json({ status: 'User Saved Successfully!!', accessToken, data:{user: newUser}});
        // console.log(newUser, req.file)

    
   
        //Send the random password to the user's email
//         const mailOptions = {
//           from: 'Smart ID Card Solution <process.env.GMAIL_USER>', // Sender's email address
//           to: email,                       // User's email address
//           subject: 'Smart ID Card Solutions',
//           html: `
//     <p>Dear ${firstName} ${lastName},</p>
//     <p>Welcome to Smart ID Card Solutions! We are excited to have you as a member of our community.</p>
//     <p>Your registration is complete, and you can now showcase your business information effortlessly.</p>
//     <p>Here are your registration details:</p>
//     <ul>
//       <li><strong>Username:</strong> ${username}</li>
//       <li><strong>Email:</strong> ${email}</li>
//       <li><strong>Phone Number:</strong> ${phoneNumber}</li>
//       <li><strong>Business Name:</strong> ${businessName}</li>
//     </ul>
//     <p>Your random password is: <strong>${randomPassword}</strong></p>
//     <p><em>Note: You can change your password after successfully signing in.</em></p>
//     <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
//     <p>Thank you for choosing Smart ID Card Solutions!</p>
//     <p>Best regards,<br>Your Smart ID Card Solutions Team</p>
//   `,
// };
      

        // transporter.sendMail(mailOptions, (error, info) => {
        //   if (error) {
        //     console.error('Error sending email:', error);
        //     return res.status(500).json({ error: 'Error sending email' });
        //   } else {
        //     console.log('Email sent:', info.response);
        //     return res.status(200).json({ message: 'User Created Successfully and Email sent with random password' });
        //   }
        // });
      
    });
      console.log('User Created Successfully!!')
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});




const profilePicUpload = handleAsync(async (req, res) => {
  const { userId } = req.params;
  try {
    const existingUser = await User.findOneAndUpdate({ _id: userId }, { profilePic: req.body });

    if (!existingUser) {
      return res.status(400).json({ error: 'Can not upload profile picture because the user does not exist' });
    }
    const imageId = crypto.randomUUID();

    existingUser.profilePic = { url: req.file.path, filename: req.file.filename, public_id: `${imageId}-${Date.now()}` };
; // Update the profilePic field
    await existingUser.save(); // Save the updated user
    
    return res.status(200).json({ msg: 'Profile picture saved', data: { existingUser } });
  } catch (err) {
    console.log('Error Uploading Profile Photo', err);
    res.status(500).json({ msg: 'Error Uploading Profile Photo' });
  }
});









module.exports = { signUp, profilePicUpload};
