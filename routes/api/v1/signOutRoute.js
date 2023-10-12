const express = require('express');
const router = express.Router();
const {signOut} = require('../../../controllers/signOutController');


router.post('/signin', signOut)




module.exports = router;


