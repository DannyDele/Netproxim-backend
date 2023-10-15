const express = require('express');
const router = express.Router();
const { signUp } = require('../../../../controllers/authController/signUpController');
const { signIn } = require('../../../../controllers/authController/signInController');
const {signOut} = require('../../../../controllers/authController/signOutController');
const { verify } = require('crypto');
const multer = require('multer');
const { storage } = require('../../../../cloudinary');
const upload = multer({ storage });




router.post('/api/v1/user/signup', upload.single('businessLogo') , signUp)
router.post('/api/v1/user/signin', signIn);
router.post('/api/v1/user/signout', signOut)








module.exports = router;





