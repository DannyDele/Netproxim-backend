const express = require('express');
const router = express.Router();
const { signUp, profilePicUpload } = require('../../../../controllers/authController/../authUserController/signUpController');
const { signIn } = require('../../../../controllers/authController/../authUserController/signInController');
const {signOut} = require('../../../../controllers/authController/../authUserController/signOutController');
const multer = require('multer');
const { storage } = require('../../../../cloudinary');
const upload = multer({ storage });


router.post('/api/v1/user/signup', upload.single('businessLogo'), signUp);
router.patch('/api/v1/user/:id/profilepicupload', upload.single('profilePic'), profilePicUpload);
router.post('/api/v1/user/signin', signIn);
// router.post('/api/v1/user/signout', signOut);








module.exports = router;





