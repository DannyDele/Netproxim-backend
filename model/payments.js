const mongoose = require('mongoose');
const { Schema } = mongoose;


const paymentSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is Required']

       
    },
    amount: {
        type: Number,
        required: [true, 'Amount is Required']
       
    },
    reference: {
        type: String
        
    },
      credoReference:{
        type: String
    },
    status: {
        type: String,
        enum:['Pending', 'Completed', 'Failed']
      },
    postDate:{
        type: Date,
        default: Date.now
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    });
    // const payment = mongoose.model('Payments', paymentSchema);
    // module.exports = {payment}
    const Payment = mongoose.model("payments",paymentSchema);
    
module.exports = Payment;
  