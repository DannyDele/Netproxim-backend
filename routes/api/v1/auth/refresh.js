// routes/users.js
const express = require('express');
const router = express.Router();
const refreshTokenController = require('../../../../controllers/authController/refreshTokenController');




router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;