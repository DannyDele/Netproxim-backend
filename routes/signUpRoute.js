const express = require('express');
const router = express.Router();
const {signUp} = require('../controllers/signUpController');




router.post('/signup', signUp)




module.exports = router;


