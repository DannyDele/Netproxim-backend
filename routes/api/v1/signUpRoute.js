const express = require('express');
const router = express.Router();
const {signUp} = require('../../../controllers/signUpController');




router.post('/api/v1/user/signup', signUp)




module.exports = router;


