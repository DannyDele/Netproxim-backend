const User = require('../model/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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




const adminSignUp = async (req, res) => {
  try {
    // Check if the user making the request is authorized (e.g., superadmin)
    // Implement your own authorization logic here

    // If authorized, proceed with admin registration
    const { username, firstName, lastName, email, phoneNumber, businessName, businessLogo } = req.body;

    // Set the role to "admin" programmatically
    const role = 'admin';

    // The rest of your signup logic remains the same
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username is taken, please choose another username.' });
    }

  
    const uniqueID = crypto.randomUUID(); //Generating UniqueID for User
    const randomPassword = generateRandomPassword(8);
    console.log(randomPassword);
    const hashPassword = await bcrypt.hash(randomPassword, 12);

    // Create a new admin user
    const newUser = new User({
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      businessName: businessName,
      businessLogo: businessLogo,
      role: role, // Set the role to "admin"
      password: hashPassword,
      confirmPassword: hashPassword,
      uniqueID: uniqueID,
      resetToken: uniqueToken,
    });

    // Save the admin user
    await newUser.save();
    res.status(200).json({ msg: 'Admin user created successfully!!', data: { user: newUser } });
  } catch (error) {
    console.error('Error during admin registration:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { adminSignUp };
