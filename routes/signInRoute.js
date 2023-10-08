const express = require('express');
const router = express.Router();
const {signIn} = require('../controllers/signInController');
const { verify } = require('crypto');


router.post('/signin', signIn);




module.exports = router;


