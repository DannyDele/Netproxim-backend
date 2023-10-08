const mongoose = require('mongoose');
const { Schema } = mongoose;
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
        required: [true, 'Email is Required']
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
    resetToken: String

    
});

// userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

module.exports = User;
 