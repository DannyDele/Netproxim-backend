// const express = require('express');
// const router = express.Router();

// // Create a signout route
// router.post('/signout', (req, res) => {
//   try {
//     // Clear the user's authentication session or remove the access token.
//     // This example assumes you're using cookies for token storage.
//     res.clearCookie('access_token'); // Replace 'access_token' with your actual cookie name

//     // You may also want to invalidate the token on the server-side if you're using JWT.
//     // This depends on your specific authentication setup.

//     // Return a success response
//     res.status(200).json({ message: 'Sign-out successful' });
//   } catch (error) {
//     console.error('Error during sign-out:', error);
//     return res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;
