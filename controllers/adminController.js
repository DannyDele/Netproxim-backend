const User = require('../model/User');
const handleAsync = require('../utils/errorHandlers/handleAsync')
const {cloudinary} = require('../cloudinary')




const getAllUsersForAdmin = handleAsync (async (req, res) => {
  try {
    const users = await User.find().select(' -password -uniqueID  -confirmPassword'); // Retrieve all users
    if (!users) {
      return res.status(400).json({msg: 'No users found'})
    }
    else{
      return res.status(200).json(users);
      }

  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});



const getUserForAdmin = handleAsync (async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you pass the user ID as a route parameter
    const user = await User.findById(userId).select('-password -uniqueID -confirmPassword');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    else{
      return res.status(200).json(user);
      }
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});




const deleteUser = handleAsync (async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you pass the user ID as a route parameter
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

     // Check if the user has an image associated with them
    if (user.businessLogo && user.businessLogo.filename) {
      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(user.businessLogo.filename);
    }
    if (user.profilePic && user.profilePic.filename) {
      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(user.profilePic.filename);
    }

    // Now, delete the user
    await user.deleteOne();
    return res.status(204).json({msg: 'User Deleted'} );  // No content, as the user has been successfully deleted
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

const deleteAllUser = handleAsync (async (req, res) => {
  try {
    const user = await User.deleteMany({});

    if (!user) {
      return res.status(404).json({ error: 'Users not found' });
    }
    

    return res.status(204).json({msg: 'Users Deleted'}); // No content, as the user has been successfully deleted
  } catch (error) {
    console.error('Error deleting users:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});


module.exports = { getUserForAdmin, deleteUser, deleteAllUser, getAllUsersForAdmin };
