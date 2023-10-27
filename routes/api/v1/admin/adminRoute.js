const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../../../../cloudinary');
const upload = multer({ storage });
const { getUserForAdmin, deleteUser, deleteAllUser, getAllUsersForAdmin} = require('../../../controllers/../../controllers/adminController');
const { adminSignUp, profilePicUpload } = require('../../../controllers/authAdminController/../../../controllers/authAdminController/adminSignUpController');
const { adminSignIn } = require('../../../controllers/authAdminController/../../../controllers/authAdminController/adminSignInController');
const { isLoggedIn } = require('../../../middleware/../../middleware/isLoggedIn');
const { isAdmin } = require('../../../middleware/../../middleware/isAdmin');



router.get('/api/v1/admin/dashboard');
router.get('/api/v1/admin/users', isLoggedIn, isAdmin, getAllUsersForAdmin);
router.get('/api/v1/admin/user/:userId', isLoggedIn, isAdmin, getUserForAdmin);

router.post('/api/v1/admin/signup', upload.single('businessLogo'), adminSignUp);
router.patch('/api/v1/admin/:id/profilepicupload', upload.single('profilePic'), profilePicUpload);
router.post('/api/v1/admin/signin', adminSignIn)
router.delete('/api/v1/admin/user/:userId', isLoggedIn, isAdmin, deleteUser);
router.delete('/api/v1/admin/users', isLoggedIn, isAdmin, deleteAllUser);


module.exports = router;