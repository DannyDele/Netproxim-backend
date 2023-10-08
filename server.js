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



const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const http = require('http'); // Import the http module for WebSocket server
const WebSocket = require('ws'); // Import the WebSocket library
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();


// Import your routes and other necessary modules here
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const signupRoute = require('./routes/signUpRoute');
const signinRoute = require('./routes/signInRoute');
const signOutRoute = require('./routes/signOutRoute');

const port = process.env.PORT || 3000;

// File Imports
// const User = require('./model/user');

const server = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/smartIdCardSolution');
    console.log('Mongo Server Up and Running!');
  } catch {
    console.log('Mongo Server Down!!');
  }
};

server();

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
app.use('/', signupRoute);
app.use('/', signinRoute);
app.use('/', signOutRoute);

// Error Handle Middleware
app.use((err, req, res, next) => {
  const { message = 'something went wrong', status = 500 } = err;
  res.status(status).send(message);
  next();
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
  });
});

httpServer.listen(port, () => {
  console.log(`Express server and WebSocket server are running on PORT: ${port}`);
});

