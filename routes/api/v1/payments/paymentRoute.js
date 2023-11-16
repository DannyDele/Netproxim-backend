const express=require('express');
const router = express.Router();

//importing payments controllers
const { postPayments, getPayments, getVerifyPayment} = require('../../../../services/credoContoller/paymentController');
router.route('/api/v1/payments').get(getPayments);
router.route('/api/v1/user/payments').post(postPayments);
router.route('/api/v1/user/verifypayments/:transRef').get(getVerifyPayment);

module.exports = router;