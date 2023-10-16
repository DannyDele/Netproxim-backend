const express = require('express');
const router = express.Router();
const {editUser, getUserInfo, forgotPassword, resetPassword, getUser} = require('../../../controllers/userController');
const { isLoggedIn  } = require('../../../middleware/isLoggedIn');



router.get('/api/v1/user/:userId', isLoggedIn, getUser);
router.get('/getuserinfo/:uniqueid', getUserInfo);
router.post('/api/v1/user/forgotpassword', forgotPassword);
router.patch('/api/v1/user/resetpassword/:token', resetPassword);
router.patch('/api/v1/user/:userid', isLoggedIn, editUser)






module.exports = router;
