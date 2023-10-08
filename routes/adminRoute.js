const express = require('express');
const router = express.Router();
const {getUser, deleteUser, deleteAllUser, getAllUsers} = require('../controllers/adminController');



router.get('/admin/dashboard');
router.get('/admin/users', getAllUsers);
router.get('/admin/user/:userId', getUser);
router.delete('/admin/user/:userId', deleteUser);
router.delete('admin//users', deleteAllUser);


module.exports = router;