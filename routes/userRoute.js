const express = require('express');
const router = express.Router();
const {editUser, getUserInfo} = require('../controllers/userController');
const { isLoggedIn  } = require('../middleware/isLoggedIn');


router.get('/admin/getUserInfo/:uniqueID', getUserInfo);
router.patch('/user/:userId', editUser)






module.exports = router;
