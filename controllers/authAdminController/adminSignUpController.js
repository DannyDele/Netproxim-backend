const User = require('../../model/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const QRcode = require('qrcode');
const nodemailer = require('nodemailer'); // Require nodemailer
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




const adminSignUp = handleAsync (async (req, res) => {
  try {
    // Check if the user making the request is authorized (e.g., superadmin)
    // Implement your own authorization logic here

    // If authorized, proceed with admin registration
    const { username, firstName, lastName, email, phoneNumber, businessName, businessLogo } = req.body;

    // Set the role to "admin" programmatically
    const roles = 'admin';

    const existingUserWithEmail = await User.findOne({ email });

    if (existingUserWithEmail) {
      return res.status(400).json({ error: 'Email is already registered. Please use a different email address.' });
    }

    // The rest of your signup logic remains the same
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username is taken, please choose another username.' });
    }

  
    const uniqueID = crypto.randomUUID(); //Generating UniqueID for User
    const randomPassword = generateRandomPassword(8);
     const imageId = crypto.randomUUID()
    console.log(randomPassword);
    const hashPassword = await bcrypt.hash(randomPassword, 12);

    // Create a new admin user
    const newAdmin = new User({
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      businessName: businessName,
      businessLogo: businessLogo,
      roles: roles, // Set the role to "admin"
      password: hashPassword,
      confirmPassword: hashPassword,
      uniqueID: uniqueID,
      resetToken: uniqueToken,
    });

    // Save image cloudinary path to the database
     newAdmin.businessLogo = { url: req.file.path, filename: req.file.filename, public_id: `${imageId}-${Date.now()}` };
       // Generate the QR code using userWithoutPassword and store the URL in newUser.qrCodeUrl
    QRcode.toDataURL(JSON.stringify(`${req.protocol}://${req.get('host')}/getuserinfo/${uniqueID}`), async (err, url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return res.status(500).json({ error: 'Error generating QR code' });
      } else {
        newAdmin.qrCodeUrl = url; // Store the QR code URL in the user object
        }
         
      //   // signing a jwt token to a user
      // const Accesstoken = jwt.sign({ id: newAdmin._id, role: newAdmin.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.LOGIN_EXPIRES });
      // const refreshToken = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });
      // newUser.refreshToken = refreshToken;

      //  // Set the token in the Authorization header
      //  res.setHeader('Authorization', `Bearer ${Accesstoken}`);

       const roles = newAdmin.roles;
    const accessToken = jwt.sign(
      { newAdmin: { id: newAdmin._id, roles: newAdmin.roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' }
    );
    
    const refreshToken = jwt.sign(
      { newAdmin: { id: newAdmin._id, roles: newAdmin.roles } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Store refreshToken in database
    newAdmin.refreshToken = refreshToken;
    await newAdmin.save();
    
     res.setHeader('Authorization', `Bearer ${refreshToken}`);

    res.cookie('jwtCookie', refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

        console.log(accessToken)


    // Save the admin user
      res.status(200).json({ msg: 'Admin user created successfully!!', accessToken,data: { user: newAdmin } });
      
   
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
  } catch (error) {
    console.error('Error during admin registration:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = { adminSignUp };
