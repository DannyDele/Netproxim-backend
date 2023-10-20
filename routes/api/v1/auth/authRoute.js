const express = require('express');
const router = express.Router();
const { signUp, profilePicUpload } = require('../../../../controllers/authController/signUpController');
const { signIn } = require('../../../../controllers/authController/signInController');
const {signOut} = require('../../../../controllers/authController/signOutController');
const { verify } = require('crypto');
const multer = require('multer');
const { storage } = require('../../../../cloudinary');
const upload = multer({ storage });




// router.post('/api/v1/user/signup', upload.fields([
//   { name: 'businessLogo', maxCount: 1 },
//   { name: 'profilePic', maxCount: 1 }
// ]), signUp);
router.post('/api/v1/user/signup', upload.single('businessLogo'), signUp);
router.patch('/api/v1/user/:userId/profilepicupload', upload.single('profilePic'), profilePicUpload);
router.post('/api/v1/user/signin', signIn);
router.post('/api/v1/user/signout', signOut);








module.exports = router;





