const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
// const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = Schema({
    uniqueID: {
    type: String,
    unique: true,
    required: true,
  },
     username: {
        type: String,
        required: [true, 'Username is Required']
    }, 
    firstName: {
        type: String,
        required: [true, 'First Name is Required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is Required']
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        // unique: true,
        // lowercase: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone Number is Required']
    },
    businessName: {
        type: String,
        required: [true, 'Business Name is Required']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm password'],
        validate: {
            validator: function (val) {
                return val == this.password
            },
            message: 'Password and confirmPassword does not match'
        }
    },
    qrCodeUrl: {
    type: String,
  },
   
    // business_logo: {
    //     type: String,
    //     required: [true, 'Email is Required']
    // },
     role: {
    type: String,
    enum: ['user', 'admin', 'superAdmin'],
    default: 'user',
    },
    passwordResetToken: String,
    passwordChangedAt: Date,    
    passwordResetTokenExpires: Date

    
});

userSchema.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
     console.log(resetToken, this.passwordResetToken)
    return resetToken;
}

// userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

module.exports = User;
 