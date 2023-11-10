const mongoose =require('mongoose');
const paymentSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum:['Pending', 'Completed', 'Failed']
      },
    postDate:{
        type: Date,
        default: Date.now
    },
    });
    // const payment = mongoose.model('Payments', paymentSchema);
    // module.exports = {payment}
    module.exports = mongoose.model("payments",paymentSchema);
  