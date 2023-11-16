
const express = require('express');
const mongoose = require('mongoose');
const Payments = require('../../model/payments');
const User = require('../../model/User');
//const db = require("../config/database");
const axios = require("axios");
const sandbox = "https://api.public.credodemo.com";
let API_KEY = `0PUB0343N2CgejxQoEkP5bu7DzZZSUud`;
let API_KEY_SECRET = "0PRI0343us0tG069f18IHz9x2vITINau";


exports.getPayments = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            middleware: req.user,
            message: "All payments"
        });
    } catch (error) {
        console.error('Error in getPayments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.postPayments = async (req, res, next) => {

    const requestData = {
        amount: req.body.amount,
        bearer: 0,
        callbackUrl: req.body.callbackUrl,
        channels: ["card", "bank"],
        currency: req.body.currency,
        customerFirstName: req.body.customerFirstName,
        customerLastName: req.body.customerLastName,
        customerPhoneNumber: req.body.customerPhoneNumber,
        email: req.body.email
    };

    const headers = {
        Authorization: API_KEY,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(sandbox + "/transaction/initialize", requestData, { headers });

        // const { id } = req.params;
        const email = requestData.email;
        const amount = requestData.amount;
        const reference = response.data.data.reference;
        const credoReference = response.data.data.credoReference;
        const payment = new Payments({
            email: email,
            amount: amount,
            reference: reference,
            credoReference:credoReference,
            status: "Pending"
        });
          try {
        const user = await User.findOne({email: email});

              if (!user) {
                  return res.status(400).json({ msg: 'User not found, cannot proceed to payment' });
              }
              else {
            user.payments.push(payment)
         console.log(req.body)
        // await user.save()
        // await payment.save();
        res.redirect(`https://pay.credodemo.com/${response.data.data.credoReference}`);       

              }
    } catch (error) {
        console.error('Error in Finding User:', error);
        // return res.status(500).json({ error: 'Internal Server Error' });
    }
     

        // Redirect to `https://www.credodemo.com/checkout/${response.data.data.reference}`
        // res.status(200).send(response.data);
    } catch (error) {
        console.error("Error in Transaction Initialization:", error);
        res.status(401).send({ Error: error.message });
    }
};

//verify payment
exports.getVerifyPayment = async (req, res, next) => {
    try {
        const transRef = req.params.transRef;
        const ref = req.params.reference;

        const headers = {
            Authorization: API_KEY_SECRET,
            "Content-Type": "application/json",
        };

        const response = await axios.get(sandbox + `/transaction/${transRef}/verify`, {
            headers,
        });

        if (response.data.data.status === 0) {
            const reference = response.data.data.businessRef;
            const status = "Completed";

            console.log(reference);

            const payment = await Payments.findOneAndUpdate(
                { reference: reference },
                { $set: { status: status } },
                { new: true }
            );

            await payment.save();

            res.send({
                Data: response.data,
            });
        } else if (response.data.data.status === 3) {
            res.send({
                Message: "failed",
                status: response.data,
            });
        }
    } catch (error) {
        console.error("Error in Verify Payment:", error);
        return res.status(401).send({
            Error: error.message,
        });
    }
};
