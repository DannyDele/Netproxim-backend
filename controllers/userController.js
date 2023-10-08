const User = require('../model/User');
const bcrypt = require('bcrypt');

const editUser = async (req, res) => {
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
};


 // Define the endpoint to get user information by unique ID
const getUserInfo =  async (req, res) => {
  const { uniqueID } = req.params;

  try {
    // Find the user by unique ID and exclude the password field
    const user = await User.findOne({ uniqueID }).select('-password -uniqueID -role -_id -qrCodeUrl' );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user information as a response
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error retrieving user information:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


const resetPassword = async (req, res) => {
  const { id } = req.params;
  const password = req.body;
  try{
    const user = await User.findById(id);
    if (!user) {
      return res.send(404).json({ msg: 'can not update password' });
    }
    const resetPasssword = await bcrypt.hash(password, 12)
    user.password = resetPasssword
    await user.save()
  }
  catch (err) {
    console.log('Error resetting password:', err);
    res.send(200).json(User.password)
  }
}


module.exports = {  editUser , getUserInfo };
