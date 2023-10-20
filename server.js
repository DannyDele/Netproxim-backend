// const express = require('express');
// const app = express();
// const path = require('path');
// const mongoose = require('mongoose');
// // const ejs = require('ejs');
// // const methodOverride = require('method-override');
// const port = 3000;
// const session = require('express-session');
// const flash = require('connect-flash');



// // File Inportsx`
// // const User = require('./model/user');
// const userRoute = require('./routes/userRoute');
// const signupRoute = require('./routes/signUpRoute');
// const signinRoute = require('./routes/signInRoute');
// const signOutRoute = require('./routes/signOutRoute');




// const server = async () => {
//     try {
//         await mongoose.connect('mongodb://127.0.0.1:27017/smartIdCardSolution');
//         console.log('Mongo Server Up and Running!');
//     }
//     catch {
//         console.log('Mongo Server Down!!');
//     }

// }

// server();

// const config = { secret: 'notagoodsecret', resave: false, saveUninitialized: false }
// app.use(session(config));
// app.use(flash());



// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// // app.use(methodOverride('_method'));


// app.set('views', path.join(__dirname, '/views'));
// app.set('view engine', 'ejs');

// // Routes
// app.use('/', userRoute);
// app.use('/', signupRoute);
// app.use('/', signinRoute);
// app.use('/', signOutRoute);


// // Error Handle Middleware
// app.use((err, req, res, next) => {
//     const { message = 'something went wrong', status = 500 } = err;
//     res.status(status).send(message);
//     next()
// })

// app.listen(`${port}`, () => {
//     console.log(`Server Up on PORT: ${port}`)
// });

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();

}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const http = require('http'); // Import the http module for WebSocket server
const WebSocket = require('ws'); // Import the WebSocket library
const session = require('express-session');
const flash = require('connect-flash');
const { MongoClient, ServerApiVersion } = require('mongodb');


// Importing routes and other necessary modules here
const userRoute = require('./routes/api/v1/userRoute');
const adminRoute = require('./routes/api/v2/adminRoute');
const authRoute = require('./routes/api/v1/auth/authRoute');
const refreshRoute = require('./routes/api/v1/auth/refresh'); 

const port = process.env.PORT || 3000;


async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb+srv://danielpope660:sF791PfhkXIxreif@cluster0.9gzokil.mongodb.net/smartIdCardSystem?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true, // Use the new server discovery and monitoring engine
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

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Routes
app.use('/', userRoute);
app.use('/', adminRoute)
app.use('/', authRoute);
app.use('/', refreshRoute)



// Error Handle Middleware
app.use((err, req, res, next) => {
  const { message = 'something went wrong', status = 500 } = err;
  res.status(status).send(message);
});

// Create an HTTP server that Express and WebSocket will share
const httpServer = http.createServer(app);

// Create a WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Handle WebSocket messages here
    // Example: You can process the message (unique ID) and send back user information
    // ws.send(JSON.stringify(userInfo));
      try {
      // Parse the QR code data (JSON in this case) received from the client
      const qrCodeData = JSON.parse(message);
      const uniqueID = qrCodeData.uniqueID;

      // Construct the redirect URL
      const redirectURL = `/getuserinfo/${uniqueID}`;

      // Send the redirect URL to the WebSocket client
      ws.send(JSON.stringify({ redirectURL }));
    } catch (error) {
      console.error('Error processing QR code data:', error);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Express server and WebSocket server are running on PORT: ${port}`);
});

