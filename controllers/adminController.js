const User = require('../model/User');




const getAllUsersForAdmin = async (req, res) => {
  try {
    const users = await User.find().select(' -password -uniqueID  -confirmPassword'); // Retrieve all users
    if (!users) {
      return res.status(400).json({msg: 'No users found'})
    }
    return res.status(200).json(users);

  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};



const getUserForAdmin = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you pass the user ID as a route parameter
    const user = await User.findById(userId).select('-password -uniqueID -confirmPassword');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};




const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you pass the user ID as a route parameter
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(204).send( 'User Deleted'); // No content, as the user has been successfully deleted
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

const deleteAllUser = async (req, res) => {
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
};


module.exports = { getUserForAdmin, deleteUser, deleteAllUser, getAllUsersForAdmin };
