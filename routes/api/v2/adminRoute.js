const express = require('express');
const router = express.Router();
const { getUserForAdmin, deleteUser, deleteAllUser, getAllUsersForAdmin } = require('../../../controllers/adminController');
const { adminSigUp } = require('../../../controllers/adminSignUpController');



router.get('/api/v2/admin/dashboard');
router.get('/api/v2/admin/users', getAllUsersForAdmin);
router.get('/api/v2/admin/user/:userId', getUserForAdmin);
router.delete('/api/v2/admin/user/:userId', deleteUser);
router.delete('/api/v2/admin/users', deleteAllUser);


module.exports = router;