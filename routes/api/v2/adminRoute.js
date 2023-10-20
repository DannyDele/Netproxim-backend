const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../../../cloudinary');
const upload = multer({ storage });
const { getUserForAdmin, deleteUser, deleteAllUser, getAllUsersForAdmin} = require('../../../controllers/adminController');
const { adminSignUp } = require('../../../controllers/authAdminController/adminSignUpController');
const { adminSignIn } = require('../../../controllers/authAdminController/adminSignInController');
const { isLoggedIn } = require('../../../middleware/isLoggedIn');
const { isAdmin } = require('../../../middleware/isAdmin');



router.get('/api/v2/admin/dashboard');
router.get('/api/v2/admin/users', isAdmin, getAllUsersForAdmin);
router.get('/api/v2/admin/user/:userId',isAdmin, getUserForAdmin);
router.post('/api/v2/admin/signup', upload.single('businessLogo'), adminSignUp);
router.post('/api/v2/admin/signin', adminSignIn)
router.delete('/api/v2/admin/user/:userId', deleteUser);
router.delete('/api/v2/admin/users', isAdmin, deleteAllUser);


module.exports = router;