const express=require('express');
const router = express.Router();

//importing payments controllers
const { postPayments, getPayments, getVerifyPayment} = require('../../../../controllers/credoContoller/paymentController');
router.route('/api/v1/payments').get(getPayments);
router.route('/api/v1/payments').post(postPayments);
router.route('/api/v1/verifypayments/:transRef').get(getVerifyPayment);

module.exports = router;