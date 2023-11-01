const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');

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
    address: {
        type: String,
        required: [true, 'Address is Required'],
  },
    
    facebook: {
        type: String,
  },
    
    instagram: {
        type: String,
  },
    
    twitter: {
        type: String,
  },
    whatsapp: {
        type: String,
  },
    
    phoneNumber: {
        type: String,
        required: [true, 'Phone Number is Required']
  },
  
  gender:{
    type: String,
    enum: ['male', 'female', 'others']
  },
  
  businessName: {
    type: String,
    required: [true, 'Business Name is Required']

  },
  businessAddress: {
    type: String,
    required: [true, 'Business Address is Required']

  },
    
   businessLogo: {
      filename: {
         type: String,
        required: true
  },
  url: {
    type: String,
    required: true
     },
     public_id: {
      type: String, // Store the Cloudinary public_id
      required: true
    }

  },
   
   profilePic: {
      filename: {
         type: String,
        
  },
  url: {
    type: String,
  
     },
     public_id: {
      type: String, // Store the Cloudinary public_id
    }
    },

   role: {
    type: String,
    enum: ['user', 'admin', 'superAdmin'],
    default: 'user',
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

    passwordResetToken: String,
    passwordChangedAt: Date,    
  passwordResetTokenExpires: Date,
    
  
    viewCount: {
    type: Number,
    default: 0, // Initialize the scan count to 0
  },
    
      viewEvents: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

    
});

userSchema.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  console.log(resetToken, this.passwordResetToken);
    return resetToken;
}

userSchema.methods.isPasswordChanged = async function (JWTtimeStamp) {
  if (this.passwordChangedAt) {
    const pswdChangedTimeStamp = pasrseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(pswdChangedTimeStamp, JWTtimeStamp);

    return JWTtimeStamp < pswdChangedTimeStamp;
  }
  return false
}
const User = new mongoose.model('User', userSchema);

module.exports = User;
 