
// // Allow requests from a specific client domain (replace 'http://your-client-domain.com' with your client's domain)
// const allowedOrigins = [process.env.CORS_OPTION];

// // Configure CORS options
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };




// module.exports = {corsOptions}


const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env' });
} else {
  dotenv.config({ path: '.env.production.local' });
}

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'x-api-key', 'x-api-host'],
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
  preflightContinue: false,
};

module.exports = corsOptions;


