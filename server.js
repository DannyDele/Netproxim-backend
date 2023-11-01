if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();

}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');




// Importing routes and other necessary modules here
const userRoute = require('./routes/api/v1/user/userRoute');
const adminRoute = require('./routes/api/v1/admin/adminRoute');
const authRoute = require('./routes/api/v1/user/authRoute');

const port = process.env.PORT || 3000;


async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.CONN_STR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,  // Use the new server discovery and monitoring engine
    });
    console.log('MongoDB database Connection Established Successfully!!');
  } catch (error) {
    console.error('MongoDB database Connection Failed:', error);
  }
}

// Call the function to establish the connection
connectToDatabase();




const config = { secret: 'notagoodsecret', resave: false, saveUninitialized: false };
app.use(session(config));
app.use(flash());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
app.use('/', userRoute);
app.use('/', adminRoute)
app.use('/', authRoute);




// Error Handle Middleware
app.use((err, req, res, next) => {
  const { message = 'something went wrong', status = 500 } = err;
  res.status(status).send({msg: message });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})